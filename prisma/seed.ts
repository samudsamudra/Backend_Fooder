import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      name: 'Manager',
      email: 'manager@example.com',
      password: 'managerpassword', // Ideally, hash the password
      role: 'MANAGER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      name: 'Cashier',
      email: 'cashier@example.com',
      password: 'cashierpassword', // Ideally, hash the password
      role: 'CASHIER',
    },
  });

  // Create menus
  const menu1 = await prisma.menu.create({
    data: {
      uuid: uuidv4(),
      name: 'Burger',
      price: 50000,
      category: 'FOOD',
      description: 'Delicious beef burger',
    },
  });

  const menu2 = await prisma.menu.create({
    data: {
      uuid: uuidv4(),
      name: 'Coke',
      price: 15000,
      category: 'DRINK',
      description: 'Refreshing soda drink',
    },
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      uuid: uuidv4(),
      customer: 'John Doe',
      table_number: 'A1',
      total_price: 65000,
      payment_method: 'CASH',
      status: 'NEW',
      userId: user2.id,
    },
  });

  // Create order lists
  await prisma.orderList.create({
    data: {
      uuid: uuidv4(),
      quantity: 1,
      note: 'No onions',
      menuId: menu1.id,
      orderId: order1.id,
    },
  });

  await prisma.orderList.create({
    data: {
      uuid: uuidv4(),
      quantity: 1,
      note: '',
      menuId: menu2.id,
      orderId: order1.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });