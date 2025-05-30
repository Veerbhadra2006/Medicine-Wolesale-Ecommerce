// utils/supportEmailTemplate.js

const supportEmailTemplate = ({ name, email, message }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #007bff;">📩 New Support Request</h2>
      <table style="width: 100%; max-width: 600px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">👤 Name:</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">📧 Email:</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">📝 Message:</td>
          <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; font-size: 13px; color: #888;">This message was sent via the IdealPharma Support Form.</p>
    </div>
  `;
};

export default supportEmailTemplate;
