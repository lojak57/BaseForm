import { Resend } from 'resend';

// Define email template types
export interface OrderConfirmationEmailProps {
  customerName: string;
  customerEmail: string;
  orderItems: {
    name: string;
    price: number;
    quantity: number;
    fabricLabel: string;
  }[];
  orderTotal: number;
  orderDate: string;
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderNotes?: string;
}

export interface NewOrderNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderItems: {
    name: string;
    price: number;
    quantity: number;
    fabricLabel: string;
  }[];
  orderTotal: number;
  orderDate: string;
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderNotes?: string;
}

class EmailService {
  private resend: Resend | null = null;
  private RESEND_API_KEY: string | undefined;
  private SHOP_OWNER_EMAIL: string = 'vcsews@example.com'; // Replace with Vicki's actual email
  private FROM_EMAIL: string = 'orders@vcsews.com'; // Replace with your verified domain
  
  constructor() {
    // Check for API key in environment variables
    this.RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
    
    // Initialize Resend if API key is available
    if (this.RESEND_API_KEY) {
      this.resend = new Resend(this.RESEND_API_KEY);
    } else {
      console.warn('Resend API key not found. Email sending is disabled.');
    }
  }

  /**
   * Sends an order confirmation email to the customer
   */
  async sendOrderConfirmationEmail(props: OrderConfirmationEmailProps): Promise<boolean> {
    if (!this.resend) {
      console.warn('Email service not initialized. Skipping order confirmation email.');
      return false;
    }

    try {
      const { customerName, customerEmail, orderItems, orderTotal, orderDate, shippingAddress } = props;
      
      // Format order items for email
      const formattedItems = orderItems.map(item => 
        `${item.quantity}x ${item.name} (${item.fabricLabel}) - $${item.price.toFixed(2)}`
      ).join('<br>');
      
      // Format shipping address
      const formattedAddress = [
        shippingAddress.street,
        shippingAddress.apartment,
        `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        shippingAddress.country
      ].filter(Boolean).join('<br>');

      const { data, error } = await this.resend.emails.send({
        from: `VC Sews <${this.FROM_EMAIL}>`,
        to: [customerEmail],
        subject: 'Your VC Sews Order Confirmation',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D1A24B;">Order Confirmation</h1>
            <p>Dear ${customerName},</p>
            <p>Thank you for your order with VC Sews! We've received your payment and are processing your order.</p>
            
            <h2>Order Details:</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Items:</strong></p>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedItems}
            </div>
            
            <p><strong>Total:</strong> $${orderTotal.toFixed(2)}</p>
            
            <h2>Shipping Address:</h2>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedAddress}
            </div>
            
            <p>We'll notify you once your order ships. If you have any questions, please contact us.</p>
            
            <p>Thank you for supporting handcrafted products!</p>
            <p>Sincerely,<br>Vicki<br>VC Sews</p>
          </div>
        `,
      });

      if (error) {
        console.error('Failed to send order confirmation email:', error);
        return false;
      }

      console.log('Order confirmation email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  }

  /**
   * Sends a new order notification email to the shop owner (Vicki)
   */
  async sendNewOrderNotificationEmail(props: NewOrderNotificationProps): Promise<boolean> {
    if (!this.resend) {
      console.warn('Email service not initialized. Skipping new order notification email.');
      return false;
    }

    try {
      const { 
        customerName, 
        customerEmail, 
        customerPhone, 
        orderItems, 
        orderTotal, 
        orderDate, 
        shippingAddress,
        orderNotes 
      } = props;
      
      // Format order items for email
      const formattedItems = orderItems.map(item => 
        `${item.quantity}x ${item.name} (${item.fabricLabel}) - $${item.price.toFixed(2)}`
      ).join('<br>');
      
      // Format shipping address
      const formattedAddress = [
        shippingAddress.street,
        shippingAddress.apartment,
        `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        shippingAddress.country
      ].filter(Boolean).join('<br>');

      const { data, error } = await this.resend.emails.send({
        from: `VC Sews Orders <${this.FROM_EMAIL}>`,
        to: [this.SHOP_OWNER_EMAIL],
        subject: `New Order from ${customerName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D1A24B;">New Order Received!</h1>
            <p>A new order has been placed on your shop.</p>
            
            <h2>Customer Information:</h2>
            <ul>
              <li><strong>Name:</strong> ${customerName}</li>
              <li><strong>Email:</strong> ${customerEmail}</li>
              ${customerPhone ? `<li><strong>Phone:</strong> ${customerPhone}</li>` : ''}
            </ul>
            
            <h2>Order Details:</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Items:</strong></p>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedItems}
            </div>
            
            <p><strong>Total:</strong> $${orderTotal.toFixed(2)}</p>
            
            <h2>Shipping Address:</h2>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedAddress}
            </div>
            
            ${orderNotes ? `
              <h2>Order Notes:</h2>
              <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
                ${orderNotes}
              </div>
            ` : ''}
            
            <p>Please process this order at your earliest convenience.</p>
          </div>
        `,
      });

      if (error) {
        console.error('Failed to send new order notification email:', error);
        return false;
      }

      console.log('New order notification email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending new order notification email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService(); 