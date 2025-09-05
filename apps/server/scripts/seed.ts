/* Minimal seed script for development (iteration 0013)
   Run: npm --workspace @oui-maitre/server run prisma:generate && npm --workspace @oui-maitre/server run seed
*/
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a MJ user
  const mj = await prisma.user.upsert({
    where: { email: 'mj@example.com' },
    create: { email: 'mj@example.com', displayName: 'MJ' },
    update: {},
  });

  // Create a world
  const world = await prisma.world.create({
    data: { name: 'Mon Premier Monde', ownerUserId: mj.id },
  });

  // Create two places
  const tavern = await prisma.place.create({ data: { worldId: world.id, name: 'Taverne' } });
  const square = await prisma.place.create({ data: { worldId: world.id, name: 'Place du village' } });

  // Create a template sheet
  const sheetTemplate = await prisma.sheet.create({
    data: {
      worldId: world.id,
      isTemplate: true,
      name: 'Modèle Aventurier',
      attributes: { force: 10, dex: 10 },
      capacities: [{ name: 'Coup précis', voix: 'combat' }],
      purseGold: 10,
    },
  });

  // Create character sheet by duplicating template
  const sheet = await prisma.sheet.create({
    data: {
      worldId: world.id,
      isTemplate: false,
      templateSourceId: sheetTemplate.id,
      name: 'Eldra',
      attributes: sheetTemplate.attributes,
      capacities: sheetTemplate.capacities,
      purseGold: 5,
      vision: 3,
    },
  });

  // Create character at the tavern
  await prisma.character.create({
    data: {
      worldId: world.id,
      sheetId: sheet.id,
      type: 'PC',
      currentPlaceId: tavern.id,
    },
  });

  // Basic items
  await prisma.item.create({
    data: { worldId: world.id, name: 'Épée courte', type: 'weapon', metadata: { degats_base: 2, degats_des: '1d6' }, holderType: 'place', holderId: tavern.id },
  });
  await prisma.item.create({
    data: { worldId: world.id, name: 'Cuirasse', type: 'armor', metadata: { defense: 2, malus: 1 }, holderType: 'place', holderId: square.id },
  });

  console.log('Seed complete:', { world: world.id, tavern: tavern.id, square: square.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

