export const generateEmailTemplate = (data: {
  businessName: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  message: string;
}) => {
  const { businessName,clientName, clientEmail, subject, message } = data;

  return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Client Message</title>
            <style>
            /* General Reset */
            body,
            h1,
            h2,
            h3,
            p {
                margin: 0;
                padding: 0;
            }

            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                color: #333;
                line-height: 1.6;
            }

            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            .email-header {
                background-color: #5bbad5;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }

            .email-header h1 {
                font-size: 24px;
                margin-bottom: 10px;
            }

            .email-header p {
                font-size: 14px;
                opacity: 0.9;
            }

            .email-body {
                padding: 20px;
            }

            .email-logo {
                text-align: center;
            }
            .email-logo img {
                width: 200px; 
                height: auto;
                margin-bottom: 15px;
                border-radius: 50%; 
            }

            .email-body h2 {
                font-size: 20px;
                color: #5bbad5;
                margin-bottom: 15px;
            }

            .email-body p {
                font-size: 16px;
                margin-bottom: 20px;
            }
            a{
                color:#5bbad5;
            }
            .contact-details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }

            .contact-details h3 {
                font-size: 18px;
                color: #5bbad5;
                margin-bottom: 10px;
            }

            .contact-details p {
                font-size: 14px;
                margin-bottom: 5px;
            }

            .email-footer {
                text-align: center;
                padding: 15px;
                background-color: #f4f4f9;
                font-size: 12px;
                color: #666;
            }

            .email-footer a {
                color: #5bbad5;
                text-decoration: none;
            }

            .email-footer a:hover {
                text-decoration: underline;
            }

            /* Responsive Design */
            @media (max-width: 600px) {
                .email-container {
                margin: 10px;
                }

                .email-header h1 {
                font-size: 20px;
                }

                .email-body h2 {
                font-size: 18px;
                }

                .email-body p {
                font-size: 14px;
                }
            }
            </style>
        </head>
    <body>
        <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>New Message from ${clientName}</h1>
            <p>You have received a new message from a client.</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <h2>Hello ${businessName},</h2>
            <p>A client has reached out to you with the following details:</p>

            <div class="contact-details">
            <h3>Client Details</h3>
            <p><strong>Name:</strong>  ${clientName}</p>
            <p><strong>Email:</strong>  ${clientEmail}</p>
            <p><strong>Subject:</strong>  ${subject}</p>
            <p><strong>Message:</strong>  ${message}</p>
            </div>

            <p>
            Please respond to the client at your earliest convenience. You can
            reply directly to this email or use the client's email address
            provided above.
            </p>

            <p>
            Thank you for using our services! If you have any questions, feel free
            to contact us at
            <a href="mailto:support@example.com">support@tevinly.com</a>.
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>
            &copy; ${new Date().getFullYear()} ${process.env.SITE_NAME as string}. All rights reserved.<br />
            <a href="https://tevinly.com">Visit our website</a> |
            <a href="https://tevinly.com/privacy">Privacy Policy</a>
            </p>
        </div>
        </div>
    </body>
    </html>`;
};
