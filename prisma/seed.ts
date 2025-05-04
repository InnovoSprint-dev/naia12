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

  await prisma.userAuth.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      userName: "superadmin",
      password: "12345678",
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




  await prisma.activity_source.upsert({
    where: { name: "Indirect" },
    update: {},
    create: {
      name: "Indirect",
      createdById: safty.id,
    },
  });


  await prisma.activity_source.upsert({
    where: { name: "Personal data" },
    update: {},
    create: {
      name: "Personal data",
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

  await prisma.activity_category.upsert({
    where: { name: "Broker Activity" },
    update: {},
    create: {
      name: "Broker Activity",
      createdById: safty.id,
    },
  });

  await prisma.activity_category.upsert({
    where: { name: "Internal task" },
    update: {},
    create: {
      name: "Internal task",
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



  await prisma.activity_type.upsert({
    where: { name: "Cold call" },
    update: {},
    create: {
      name: "Cold call",
      createdById: safty.id,
    },
  });



  await prisma.activity_type.upsert({
    where: { name: "Qualifying leads" },
    update: {},
    create: {
      name: "Qualifying leads",
      createdById: safty.id,
    },
  });

  await prisma.activity_type.upsert({
    where: { name: "Follow-up call" },
    update: {},
    create: {
      name: "Follow-up call",
      createdById: safty.id,
    },
  });

  await prisma.activity_type.upsert({
    where: { name: "Client meeting (In office)" },
    update: {},
    create: {
      name: "Client meeting (In office)",
      createdById: safty.id,
    },
  });


  await prisma.activity_type.upsert({
    where: { name: "Client meeting (Out side)" },
    update: {},
    create: {
      name: "Client meeting (Out side)",
      createdById: safty.id,
    },
  });


  await prisma.activity_type.upsert({
    where: { name: "WhatsApp follow-up" },
    update: {},
    create: {
      name: "WhatsApp follow-up",
      createdById: safty.id,
    },
  });


  await prisma.activity_type.upsert({
    where: { name: "Email follow-up" },
    update: {},
    create: {
      name: "Email follow-up",
      createdById: safty.id,
    },
  });

  await prisma.activity_type.upsert({
    where: { name: "Online meeting" },
    update: {},
    create: {
      name: "Online meeting",
      createdById: safty.id,
    },
  });


  await prisma.activity_type.upsert({
    where: { name: "Site visit" },
    update: {},
    create: {
      name: "Site visit",
      createdById: safty.id,
    },
  });


  await prisma.activity_type.upsert({
    where: { name: "Sending offer" },
    update: {},
    create: {
      name: "Sending offer",
      createdById: safty.id,
    },
  });


  await prisma.activity_type.upsert({
    where: { name: "Sending brochures or price list" },
    update: {},
    create: {
      name: "Sending brochures or price list",
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

  

 await prisma.project.upsert({
    where: { name: "Naia West" },
    update: {},
    create: {
      name: "Naia West",
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


  await prisma.activity_unit_type.upsert({
    where: { name: "2 Bedroom" },
    update: {},
    create: {
      name: "2 Bedroom",
      createdById: safty.id,
    },
  });


  await prisma.activity_unit_type.upsert({
    where: { name: "3 Bedroom" },
    update: {},
    create: {
      name: "3 Bedroom",
      createdById: safty.id,
    },
  });


  await prisma.activity_unit_type.upsert({
    where: { name: "TownHouse" },
    update: {},
    create: {
      name: "TownHouse",
      createdById: safty.id,
    },
  });


  await prisma.activity_unit_type.upsert({
    where: { name: "TwinHouse" },
    update: {},
    create: {
      name: "TwinHouse",
      createdById: safty.id,
    },
  });


  await prisma.activity_unit_type.upsert({
    where: { name: "StandAlone" },
    update: {},
    create: {
      name: "StandAlone",
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

  await prisma.activity_lead_status.upsert({
    where: { name: "Interested" },
    update: {},
    create: {
      name: "Interested",
      createdById: safty.id,
    },
  });


  await prisma.activity_lead_status.upsert({
    where: { name: "Not interested" },
    update: {},
    create: {
      name: "Not interested",
      createdById: safty.id,
    },
  });


  await prisma.activity_lead_status.upsert({
    where: { name: "Nees follow-up" },
    update: {},
    create: {
      name: "Nees follow-up",
      createdById: safty.id,
    },
  });


  await prisma.activity_lead_status.upsert({
    where: { name: "Reserved" },
    update: {},
    create: {
      name: "Reserved",
      createdById: safty.id,
    },
  });

  await prisma.activity_lead_status.upsert({
    where: { name: "Contracted" },
    update: {},
    create: {
      name: "Contracted",
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



    await prisma.activity_not_interested_reason.upsert({
      where: { name: "Unit availability" },
      update: {},
      create: {
        name: "Unit availability",
        createdById: safty.id,
      },
    });

    await prisma.activity_not_interested_reason.upsert({
      where: { name: "Distenation" },
      update: {},
      create: {
        name: "Distenation",
        createdById: safty.id,
      },
    });

    await prisma.activity_not_interested_reason.upsert({
      where: { name: "Unit type" },
      update: {},
      create: {
        name: "Unit type",
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
