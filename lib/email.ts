import nodemailer from 'nodemailer'
import { Order, OrderItem, Product, ProductVariant } from '@prisma/client'
import { formatPrice } from './utils'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
    variant: ProductVariant
  })[]
}

export async function sendOrderConfirmation(order: OrderWithItems) {
  const itemsList = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${item.product.name}<br>
            <span style="color: #666; font-size: 14px;">
              ${item.variant.color} / ${item.variant.size} × ${item.quantity}
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>
      `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1A1A1A; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; border-bottom: 2px solid #1A1A1A; }
        .header h1 { font-family: Georgia, serif; font-size: 32px; margin: 0; }
        .content { padding: 40px 0; }
        table { width: 100%; border-collapse: collapse; }
        .total-row { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; padding: 40px 0; color: #666; font-size: 14px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LUXURY APPAREL</h1>
        </div>
        
        <div class="content">
          <h2>Order Confirmation</h2>
          <p>Thank you for your order! We're preparing your items for shipment.</p>
          
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          
          <h3 style="margin-top: 40px;">Order Items</h3>
          <table>
            ${itemsList}
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">Subtotal</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                ${formatPrice(order.subtotal)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">Shipping</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                ${formatPrice(order.shipping)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">Tax</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                ${formatPrice(order.tax)}
              </td>
            </tr>
            <tr class="total-row">
              <td style="padding: 12px;">Total</td>
              <td style="padding: 12px; text-align: right;">${formatPrice(order.total)}</td>
            </tr>
          </table>
          
          <p style="margin-top: 40px;">
            We'll send you a shipping confirmation email with tracking information once your order ships.
          </p>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" 
               style="display: inline-block; background: #1A1A1A; color: #F7F6F3; padding: 12px 32px; text-decoration: none; margin-top: 20px;">
              View Order Details
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at support@luxuryapparel.com</p>
          <p>&copy; ${new Date().getFullYear()} Luxury Apparel. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.email,
    subject: `Order Confirmation #${order.orderNumber}`,
    html,
  })
}

export async function sendShippingNotification(
  order: OrderWithItems,
  trackingNumber: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1A1A1A; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; border-bottom: 2px solid #1A1A1A; }
        .header h1 { font-family: Georgia, serif; font-size: 32px; margin: 0; }
        .content { padding: 40px 0; }
        .tracking-box { background: #F7F6F3; padding: 20px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; padding: 40px 0; color: #666; font-size: 14px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LUXURY APPAREL</h1>
        </div>
        
        <div class="content">
          <h2>Your Order Has Shipped!</h2>
          <p>Good news! Your order #${order.orderNumber} is on its way.</p>
          
          <div class="tracking-box">
            <p><strong>Tracking Number:</strong></p>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${trackingNumber}</p>
          </div>
          
          <p>You can track your package using the tracking number above.</p>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" 
               style="display: inline-block; background: #1A1A1A; color: #F7F6F3; padding: 12px 32px; text-decoration: none; margin-top: 20px;">
              View Order Details
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at support@luxuryapparel.com</p>
          <p>&copy; ${new Date().getFullYear()} Luxury Apparel. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.email,
    subject: `Your Order Has Shipped - #${order.orderNumber}`,
    html,
  })
}