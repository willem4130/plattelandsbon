import { PrismaClient, UserRole, BusinessStatus, VoucherStatus, DiscountType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Oom Gerrit database...')

  // 1. Create categories
  console.log('📁 Creating categories...')
  const categories = [
    { name: 'Bars', slug: 'bars', description: 'Gezellige bars en cafés', icon: 'beer', sortOrder: 1 },
    { name: 'Restaurants', slug: 'restaurants', description: 'Restaurants en eetgelegenheden', icon: 'utensils', sortOrder: 2 },
    { name: 'Accommodaties', slug: 'accommodaties', description: 'Bed & Breakfasts, hotels en campings', icon: 'bed', sortOrder: 3 },
    { name: 'Activiteiten', slug: 'activiteiten', description: 'Outdoor activiteiten en recreatie', icon: 'bicycle', sortOrder: 4 },
    { name: 'Wellness', slug: 'wellness', description: 'Spa, sauna en wellness faciliteiten', icon: 'spa', sortOrder: 5 },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(created)
    console.log(`  ✅ Created category: ${created.name}`)
  }

  // 2. Create admin user
  console.log('👤 Creating admin user...')
  const hashedPassword = await hash('admin123', 10) // Change this in production!
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@oomgerrit.nl' },
    update: {},
    create: {
      email: 'admin@oomgerrit.nl',
      name: 'Admin Gebruiker',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  })
  console.log(`  ✅ Created admin user: ${adminUser.email}`)

  // 3. Create test business users
  console.log('🏢 Creating test businesses...')

  // Business 1: De Groene Weide (Restaurant)
  const business1User = await prisma.user.upsert({
    where: { email: 'contact@degroeneweide.nl' },
    update: {},
    create: {
      email: 'contact@degroeneweide.nl',
      name: 'Jan Jansen',
      role: UserRole.BUSINESS,
      emailVerified: new Date(),
    },
  })

  const business1 = await prisma.business.upsert({
    where: { userId: business1User.id },
    update: {},
    create: {
      userId: business1User.id,
      name: 'De Groene Weide',
      description: 'Biologisch restaurant midden in de prachtige Limburgse natuur. Wij serveren seizoensgebonden gerechten bereid met lokale ingrediënten.',
      address: 'Dorpsstraat 12',
      city: 'Valkenburg',
      postalCode: '6301 AB',
      province: 'Limburg',
      phone: '+31 43 601 2345',
      website: 'https://degroeneweide.nl',
      status: BusinessStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  })

  await prisma.businessCategory.create({
    data: {
      businessId: business1.id,
      categoryId: createdCategories.find(c => c.slug === 'restaurants')!.id,
    },
  })
  console.log(`  ✅ Created business: ${business1.name}`)

  // Business 2: 't Gezellige Hoekje (Bar)
  const business2User = await prisma.user.upsert({
    where: { email: 'info@gezellighoekje.nl' },
    update: {},
    create: {
      email: 'info@gezellighoekje.nl',
      name: 'Marie Pieters',
      role: UserRole.BUSINESS,
      emailVerified: new Date(),
    },
  })

  const business2 = await prisma.business.upsert({
    where: { userId: business2User.id },
    update: {},
    create: {
      userId: business2User.id,
      name: "'t Gezellige Hoekje",
      description: 'Bruine kroeg met authentieke sfeer. Kom genieten van een goed glas bier en lokale borrelsnacks.',
      address: 'Marktplein 5',
      city: 'Roermond',
      postalCode: '6041 EM',
      province: 'Limburg',
      phone: '+31 475 123 456',
      website: 'https://gezellighoekje.nl',
      status: BusinessStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  })

  await prisma.businessCategory.createMany({
    data: [
      {
        businessId: business2.id,
        categoryId: createdCategories.find(c => c.slug === 'bars')!.id,
      },
      {
        businessId: business2.id,
        categoryId: createdCategories.find(c => c.slug === 'restaurants')!.id,
      },
    ],
  })
  console.log(`  ✅ Created business: ${business2.name}`)

  // Business 3: Wellness Retreat Limburg (Wellness)
  const business3User = await prisma.user.upsert({
    where: { email: 'info@wellnessretreat.nl' },
    update: {},
    create: {
      email: 'info@wellnessretreat.nl',
      name: 'Sophie van Berg',
      role: UserRole.BUSINESS,
      emailVerified: new Date(),
    },
  })

  const business3 = await prisma.business.upsert({
    where: { userId: business3User.id },
    update: {},
    create: {
      userId: business3User.id,
      name: 'Wellness Retreat Limburg',
      description: 'Luxe wellness centrum met sauna, zwembad en massages. Ontspan in een rustige omgeving.',
      address: 'Bosweg 89',
      city: 'Maastricht',
      postalCode: '6211 AB',
      province: 'Limburg',
      phone: '+31 43 789 0123',
      website: 'https://wellnessretreat.nl',
      status: BusinessStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  })

  await prisma.businessCategory.create({
    data: {
      businessId: business3.id,
      categoryId: createdCategories.find(c => c.slug === 'wellness')!.id,
    },
  })
  console.log(`  ✅ Created business: ${business3.name}`)

  // 4. Create test consumer user
  console.log('👥 Creating test consumer...')
  const consumerUser = await prisma.user.upsert({
    where: { email: 'test@example.nl' },
    update: {},
    create: {
      email: 'test@example.nl',
      name: 'Test Gebruiker',
      role: UserRole.CONSUMER,
      emailVerified: new Date(),
    },
  })
  console.log(`  ✅ Created consumer: ${consumerUser.email}`)

  // 5. Create sample vouchers
  console.log('🎫 Creating sample vouchers...')

  const voucher1 = await prisma.voucher.create({
    data: {
      businessId: business1.id,
      title: '€10 korting op lunch menu',
      description: 'Geniet van €10 korting op ons heerlijke lunch menu. Geldig van maandag t/m vrijdag.',
      discountType: DiscountType.CASH,
      discountValue: 10,
      terms: 'Niet te combineren met andere acties. Geldig op werkdagen.',
      minimumPurchase: 20,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      maxClaims: 50,
      status: VoucherStatus.ACTIVE,
      approvedAt: new Date(),
      slug: '10-euro-korting-lunch-groene-weide',
    },
  })
  console.log(`  ✅ Created voucher: ${voucher1.title}`)

  const voucher2 = await prisma.voucher.create({
    data: {
      businessId: business2.id,
      title: '2e biertje gratis',
      description: 'Bij aankoop van 2 speciaalbieren krijg je de 2e gratis!',
      discountType: DiscountType.PRODUCT,
      discountDescription: '1 gratis speciaalbiertje',
      terms: 'Geldig op alle speciaalbieren uit ons assortiment.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      maxClaims: 100,
      status: VoucherStatus.ACTIVE,
      approvedAt: new Date(),
      slug: '2e-biertje-gratis-gezellig-hoekje',
    },
  })
  console.log(`  ✅ Created voucher: ${voucher2.title}`)

  const voucher3 = await prisma.voucher.create({
    data: {
      businessId: business3.id,
      title: '20% korting op massage',
      description: 'Boek een ontspannende massage en ontvang 20% korting.',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      terms: 'Geldig op alle massages van 60 minuten of langer. Reserveren verplicht.',
      minimumPurchase: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
      maxClaims: 30,
      status: VoucherStatus.ACTIVE,
      approvedAt: new Date(),
      slug: '20-procent-korting-massage-wellness-retreat',
    },
  })
  console.log(`  ✅ Created voucher: ${voucher3.title}`)

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📝 Test accounts:')
  console.log('  Admin: admin@oomgerrit.nl')
  console.log('  Business 1: contact@degroeneweide.nl')
  console.log('  Business 2: info@gezellighoekje.nl')
  console.log('  Business 3: info@wellnessretreat.nl')
  console.log('  Consumer: test@example.nl')
  console.log('\n⚠️  Note: Set up NextAuth for password authentication')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
