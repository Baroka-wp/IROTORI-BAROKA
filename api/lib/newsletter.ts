import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function sendNewsletter(post: {
  title: string;
  slug: string;
  type: string;
  description?: string | null;
}) {
  try {
    // Get all subscribers
    const subscribers = await prisma.subscriber.findMany({
      select: { email: true },
    });

    // Filter out null/empty emails
    const validSubscribers = subscribers.filter(s => s.email && s.email.trim() !== '');

    if (validSubscribers.length === 0) {
      console.log('No subscribers to notify');
      return { success: true, sent: 0 };
    }

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured. Please add it to your .env file');
    }

    const siteUrl = process.env.SITE_URL || 'https://www.irotoribaroka.com';
    const postUrl = `${siteUrl}/${post.slug}`;

    // Get more articles to suggest
    const moreArticles = await prisma.post.findMany({
      where: {
        status: 'published',
        slug: { not: post.slug },
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        slug: true,
        type: true,
      },
    });

    const moreArticlesHtml = moreArticles.map(article => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
          <a href="${siteUrl}/${article.slug}" style="color: #6B1A2A; text-decoration: none; font-size: 14px;">
            → ${article.title}
          </a>
        </td>
      </tr>
    `).join('');

    // Strip HTML tags for preview text
    const stripHtml = (html: string) => {
      const tmp = html.replace(/<[^>]*>/g, ' ');
      return tmp.substring(0, 200) + (tmp.length > 200 ? '...' : '');
    };

    const previewText = post.description || (post.content ? stripHtml(post.content) : '');

    // Use Brevo API with fetch directly (more reliable than SDK)
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'IROTORI BAROKA',
          email: process.env.BREVO_SENDER_EMAIL || 'newsletter@irotoribaroka.com',
        },
        to: validSubscribers.map(s => ({ email: s.email })),
        subject: `Nouveau : ${post.title}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${post.title}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F2ED;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F2ED; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td style="background-color: #6B1A2A; padding: 40px 30px; text-align: center;">
                          <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 300;">IROTORI BAROKA</h1>
                          <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">Une fenêtre sur mon esprit</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 40px 30px;">
                          <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">Nouveau ${post.type === 'model' ? 'réflexion' : post.type === 'video' ? 'vidéo' : 'contenu'}</p>
                          <h2 style="color: #1A1A1A; font-size: 28px; margin: 0 0 20px 0; font-weight: 400; line-height: 1.3;">${post.title}</h2>
                          ${post.description ? `<p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${post.description}</p>` : ''}

                          <!-- Full Content -->
                          <div style="color: #333333; font-size: 15px; line-height: 1.8; margin: 30px 0; padding: 30px; background-color: #FAFAFA; border-radius: 8px;">
                            ${post.content || ''}
                          </div>

                          ${post.videoUrl && post.type === 'video' ? `
                          <div style="margin: 30px 0; text-align: center;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">🎥 Vidéo disponible</p>
                            <a href="${post.videoUrl}" target="_blank" style="background-color: #6B1A2A; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 14px; display: inline-block;">Voir la vidéo</a>
                          </div>
                          ` : ''}
                        </td>
                      </tr>
                      ${moreArticles.length > 0 ? `
                      <tr>
                        <td style="padding: 30px; background-color: #F9F9F9;">
                          <h3 style="color: #1A1A1A; font-size: 18px; margin: 0 0 15px 0; font-weight: 500;">Découvrir d'autres articles</h3>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            ${moreArticlesHtml}
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="background-color: #F0F0F0; padding: 30px; text-align: center;">
                          <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">Vous recevez cet email car vous êtes abonné à la newsletter IROTORI BAROKA.</p>
                          <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} IROTORI BAROKA. Tous droits réservés.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const result = await response.json();

    console.log('✅ Newsletter sent successfully!');
    console.log('📧 Sent to', validSubscribers.length, 'subscribers');
    console.log('📬 Message ID:', result.messageId);

    return {
      success: true,
      sent: validSubscribers.length,
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error('❌ sendNewsletter error:', error.message);
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('Network error: Check your internet connection');
    }
    throw error;
  }
}
