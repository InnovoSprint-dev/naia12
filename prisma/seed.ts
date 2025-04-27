// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

import prisma from "../lib/prisma";

async function main() {
  // ... you will write your Prisma Client queries here
  const naia = await prisma.organization.upsert({
    where: { name: "Naia Developments" },
    update: {},
    create: {
      name: "Naia Developments",
    },
  });

  const broker1 = await prisma.organization.upsert({
    where: { name: "Broker1 Developments" },
    update: {},
    create: {
      name: "Broker1 Developments",
    },
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: "super.admin@naiadevelopments.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "super.admin@naiadevelopments.com",
      phone: "+201022666227",
      firstName: "Super",
      lastName: "Admin",
      position: "Developer",
      organizationId: naia.id,
    },
  });

  const safty = await prisma.user.upsert({
    where: { email: "amr.safty@naiadevelopments.com" },
    update: {},
    create: {
      fullName: "Amr Safty",
      email: "amr.safty@naiadevelopments.com",
      phone: "+201091000008",
      firstName: "Amr",
      lastName: "Safty",
      position: "Sales Manager",
      organizationId: naia.id,
      createdById: superAdmin.id,
    },
  });

  const atifRostom = await prisma.user.upsert({
    where: { email: "atif.rostom@naiadevelopments.com" },
    update: {},
    create: {
      fullName: "Atif Rostom",
      email: "atif.rostom@naiadevelopments.com",
      phone: "+201091000007",
      firstName: "Atif",
      lastName: "Rostom",
      position: "Sales Director",
      organizationId: naia.id,
      createdById: safty.id,
    },
  });

  const ranaSalama = await prisma.user.upsert({
    where: { email: "rana.salama@naiadevelopments.com" },
    update: {},
    create: {
      fullName: "Rana Salama",
      email: "rana.salama@naiadevelopments.com",
      phone: "+201091000006",
      firstName: "Rana",
      lastName: "Salama",
      position: "Sales Manager",
      managerId: atifRostom.id,
      organizationId: naia.id,
      createdById: safty.id,
    },
  });

  const mohamedAbdElAziz = await prisma.user.upsert({
    where: { email: "mohamed.abdElAziz@naiadevelopments.com" },
    update: {},
    create: {
      fullName: "Mohamed Abd El-Aziz",
      email: "mohamed.abdElAziz@naiadevelopments.com",
      phone: "+201091000005",
      firstName: "Mohamed",
      lastName: "Abd El-Aziz",
      position: "Sales Manager",
      managerId: ranaSalama.id,
      organizationId: naia.id,
      createdById: safty.id,
    },
  });

  const broker1Agent = await prisma.user.upsert({
    where: { email: "broker.agent@broker1.com" },
    update: {},
    create: {
      fullName: "Broker Agent",
      email: "broker.agent@broker1.com",
      phone: "+201091000004",
      firstName: "Broker",
      lastName: "Agent",
      position: "Sales Manager",
      managerId: mohamedAbdElAziz.id,
      organizationId: broker1.id,
      createdById: safty.id,
    },
  });

  const Activity_source = await prisma.activity_source.upsert({
    where: { name: "Direct" },
    update: {},
    create: {
      name: "Direct",
      createdById: safty.id,
    },
  });
  const Activity_category = await prisma.activity_category.upsert({
    where: { name: "Client Activity" },
    update: {},
    create: {
      name: "Client Activity",
      createdById: safty.id,
    },
  });
  const Activity_type = await prisma.activity_type.upsert({
    where: { name: "Existing Client Call" },
    update: {},
    create: {
      name: "Existing Client Call",
      createdById: safty.id,
    },
  });
  const Project = await prisma.project.upsert({
    where: { name: "Naia Bay" },
    update: {},
    create: {
      name: "Naia Bay",
      createdById: safty.id,
    },
  });
  const Activity_unit_type = await prisma.activity_unit_type.upsert({
    where: { name: "1 Bedroom" },
    update: {},
    create: {
      name: "1 Bedroom",
      createdById: safty.id,
    },
  });
  const Activity_lead_status = await prisma.activity_lead_status.upsert({
    where: { name: "Negotiating" },
    update: {},
    create: {
      name: "Negotiating",
      createdById: safty.id,
    },
  });
  const Activity_not_interested_reason =
    await prisma.activity_not_interested_reason.upsert({
      where: { name: "Budget" },
      update: {},
      create: {
        name: "Budget",
        createdById: safty.id,
      },
    });

 await prisma.activity.upsert({
    where: { activityTitle: "My first activity" },
    update: {},
    create: {
      createdById: ranaSalama.id,
      activityTitle: "My first activity",
      salesPersonId: mohamedAbdElAziz.id,
      activitySourceId: Activity_source.id,
      activityCategoryId: Activity_category.id,
      activityTypeId: Activity_type.id,
      projectId: Project.id,
      activityUnitTypeId: Activity_unit_type.id,
      activityLeadStatusId: Activity_lead_status.id,
      activityNotInterestedReasonId: Activity_not_interested_reason.id,
      clientName: "Ahmed Abdul Salam",
      salesBrokerId: broker1Agent.id,

      budget: 5000000,
      contact: "+2010111111116",
      compatetior: "Sodic",
      Remarks: "No comments",
    },
  });

  console.log("Super admin: ", superAdmin);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
