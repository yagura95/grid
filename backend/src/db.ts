import { Payment } from './types';
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  uri: process.env.MARIADB_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initDB () {
  try {
    const createTablePayments = `
      CREATE TABLE IF NOT EXISTS payments (
	      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
        payment VARCHAR(255) NOT NULL,
        amount VARCHAR(255) NOT NULL,
        code INT NOT NULL,
        grid JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTablePayments);
    console.log('Database initialized');
  } catch (e) {
    console.error('Failed to initialize database:', e);
  }
};

export async function addPayment(payment: Payment) {
  const query = 'INSERT INTO payments(payment, amount, code, grid) VALUES (?, ?, ?, ?)';
  const values = [payment.payment, payment.amount, payment.code, JSON.stringify(payment.grid)];

  try {
    await pool.query(query, values)
    console.log("Payment added")
  } catch(e) {
    console.error("Failed to add payment: ", e)
  }
}

export async function getAllPayments(): Promise<Payment[] | []> {
  const query = 'SELECT * FROM payments';

  try {
    const values = await pool.query(query)
    console.log("Payments retrieved")
    return values[0] as Payment[]
  } catch(e) {
    console.error("Failed to get all payments: ", e)
    return []
  }
}
