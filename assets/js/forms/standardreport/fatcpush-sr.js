
var filledProjectFocusArea = [];
var totalProjectBudget = [];
const maxWords = 200;

const categoryIncome = [
  {
    name: "Locally generated income",
    code: "Locally generated income",
    id: "AwylsBWgOEK",
    options: [
      {
        "name": "Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)",
        "code": "Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)",
        "id": "jcpKbxwFq6D",
        format: "commodity-sales"
      },
      {
        "name": "Client/Patient fees",
        "code": "Client/Patient fees",
        "id": "lGsKx2RbUSW",
        format: "client-fees"
      },
      {
        "name": "Training, education, professional services and rentals",
        "code": "Training, education, professional services and rentals",
        "id": "KqYleOvKzJ2",
        format: "services-rental"
      },
      {
        "name": "Local/national: government",
        "code": "Local/national: government",
        "id": "RGp6uJXqNOk",
        format: "local-government"
      },
      {
        "name": "Local/national: non-government",
        "code": "Local/national: non-government",
        "id": "aE0fJm2QDgh",
        format: "local-nongovernment"
      },
      {
        "name": "Membership fees",
        "code": "Membership fees",
        "id": "QhSUed8nt0j",
        format: "membership-fees"
      },
      {
        "name": "Non-operational income",
        "code": "Non-operational income",
        "id": "iHRoyMrZtsF",
        format: "nonoperational-income"
      },
      {
        "name": "Other national income",
        "code": "Other national income",
        "id": "gGAAt4veTgw",
        format: "other-income"
      },
    ],
  },
  {
    name: "International income (Non - IPPF)",
    code: "International income (Non - IPPF)",
    id: "EbbYrTYLZNZ",
    options: [
      {
        "name": "Multilateral Agencies and Organizations",
        "code": "Multilateral Agencies and Organizations",
        "id": "BHUbX12N9ob",
        format: "multinational-agencies"
      },
      {
        "name": "Foreign Governments",
        "code": "Foreign Governments",
        "id": "Vz4kD0k9cgj",
        format: "foriegn-governments"
      },
      {
        "name": "International Trusts and Foundations / NGOs",
        "code": "International Trusts and Foundations / NGOs",
        "id": "QPijCkeuCIf",
        format: "interational-trusts"
      },
      {
        "name": "Corporate / Business Sector",
        "code": "Corporate / Business Sector",
        "id": "WvYNbgB1Rgh",
        format: "corporate-sector"
      },
      {
        "name": "Other International Income",
        "code": "Other International Income",
        "id": "aT0dYEvFiLO",
        format: "other-international-income"
      },
    ],
  },
  {
    name: "IPPF income",
    code: "IPPF income",
    id: "iKycH3397wP",
    options: [
      {
        "name": "IPPF Core Grant",
        "code": "IPPF Core Grant",
        "id": "D0YD3aNWqGp",
        format: "ippf-unrestricted"
      },
      {
        "name": "Other IPPF Grant",
        "code": "Other IPPF Grant",
        "id": "fOsunx90DGG",
        format: "ippf-restricted"
      }
    ],
  },
];
const focusAreaOptions = [{
  "code": "1. Care: Static Clinic",
  "name": "1. Care: Static Clinic",
  "id": "CZLBwESjbAX",
  "index": 1,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
  }]
},
{
  "code": "2. Care: Outreach, mobile clinic, Community-based, delivery",
  "name": "2. Care: Outreach, mobile clinic, Community-based, delivery",
  "id": "OChleCDWjL3",
  "index": 2,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
  }]
},
{
  "code": "3. Care: Other Services, enabled or referred (associated clinics)",
  "name": "3. Care: Other Services, enabled or referred (associated clinics)",
  "id": "wqByE5DAD2B",
  "index": 3,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
  }]
},
{
  "code": "4. Care: Social Marketing Services",
  "name": "4. Care: Social Marketing Services",
  "id": "fXav463CcEs",
  "index": 4,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
  }]
},
{
  "code": "5. Care: Digital Health Intervention and Selfcare",
  "name": "5. Care: Digital Health Intervention and Selfcare",
  "id": "yaHKcQ0QD8R",
  "index": 5,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
  }]
},
{
  "code": "6. Advocacy",
  "name": "6. Advocacy",
  "id": "R4l1TP5OZEG",
  "index": 6,
  pillars: [{
    "code": "2. Move the Sexuality Agenda",
    "name": "2. Move the Sexuality Agenda",
    "id": "aWqHHcdbAxP",
    "index": 2,
  }]
},
{
  "code": "7. CSE",
  "name": "7. CSE",
  "id": "Nh55R7CiG1p",
  "index": 7,
  pillars: [{
    "code": "2. Move the Sexuality Agenda",
    "name": "2. Move the Sexuality Agenda",
    "id": "aWqHHcdbAxP",
    "index": 2,
  }]
},
{
  "code": "8. CSE Online, including social media",
  "name": "8. CSE Online, including social media",
  "id": "aMdeIx8pRwa",
  "index": 8,
  pillars: [{
    "code": "2. Move the Sexuality Agenda",
    "name": "2. Move the Sexuality Agenda",
    "id": "aWqHHcdbAxP",
    "index": 2,
  }]
},
{
  "code": "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting",
  "name": "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting",
  "id": "njWSsl6dYmM",
  "index": 9,
  pillars: [{
    "code": "3. Solidarity for Change",
    "name": "3. Solidarity for Change",
    "id": "RRZ2NLpKIO7",
    "index": 2,
  }]
},
{
  "code": "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles",
  "name": "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles",
  "id": "NLcmQt3b23t",
  "index": 10,
  pillars: [{
    "code": "3. Solidarity for Change",
    "name": "3. Solidarity for Change",
    "id": "RRZ2NLpKIO7",
    "index": 3,
  }]
},
{
  "code": "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures",
  "name": "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures",
  "id": "Th0iZtCIeOQ",
  "index": 11,
  pillars: [{
    "code": "4. Nurture Our Federation",
    "name": "4. Nurture Our Federation",
    "id": "T9b4CVvuq81",
    "index": 4,
  }]
}
]

const strategicPillarOptions = [{
  "code": "1. Center Care on People",
  "name": "1. Center Care on People",
  "id": "Cnof6vSGlxa",
  "index": 1
},
{
  "code": "2. Move the Sexuality Agenda",
  "name": "2. Move the Sexuality Agenda",
  "id": "aWqHHcdbAxP",
  "index": 2
},
{
  "code": "3. Solidarity for Change",
  "name": "3. Solidarity for Change",
  "id": "RRZ2NLpKIO7",
  "index": 3
},
{
  "code": "4. Nurture Our Federation",
  "name": "4. Nurture Our Federation",
  "id": "T9b4CVvuq81",
  "index": 4
}
]

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to each list item
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default action
      var targetPage = event.currentTarget.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });



  async function fetchOrganizationUnitUid() {
    try {
      const response = await fetch(
        `../../me.json?fields=id,username,userGroups[id,name],organisationUnits[id,name,path,code,level,parent[id,name]]`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      var data;
      const masterOU = window.localStorage.getItem("masterOU");
      if (masterOU) {
        data = { organisationUnits: [{ ...JSON.parse(masterOU) }] };
        tei.disabled = window.localStorage.getItem("userDisabled");
      }
      if (!data) {
        data = await response.json();

        const userConfig = userGroupConfig(data)
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
      }

      if (data.organisationUnits && data.organisationUnits.length > 0) {
        tei.orgUnit = data.organisationUnits[0].id;
        document.getElementById('orgunit-name').innerHTML = data.organisationUnits[0].name;
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    tei.projects = [];
    dataElements.period.value = '2023 - 2025';
    tei.program = program.auProjectFocusArea;
    tei.programStage = programStage.auProjectFocusArea;
    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }

    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => 
            enroll.program == program.arTotalIncome 
        );


          var countId = 0;
          const dataValuesTIAR = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, 
            {id: dataElements.year.id, value: '2024' }, 
            {id: dataElements.periodicity.id, value: 'Annual Reporting'}
          ); //data vlaues period wise
          if (dataValuesTIAR['event']) {
            const eventTI = dataValuesTIAR['event'];

          await pushDataElementOther(dataElements.submitAnnualUpdate,'', program.arTotalIncome, programStage.arTotalIncome, eventTI);
           console.log(++countId, tei.orgUnit)
          }
          
      

    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  fetchOrganizationUnitUid();
});


function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names = [];
  if (values) {
    projects.forEach(project => {
      if (values[project.name]) {
        names = [...names, ...prevEmptyNames, values[project.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}


function loadCalculatedVariables(
  dataValuesFA
) {
  var newFA = [];
  
  for(let index=0; index<=99; index++) {
    var oldFA = [];
    dataElements.projectFocusAreaNew[index].focusAreas.forEach((focusAreaId) => {
      if (dataValuesFA[focusAreaId]) {
        oldFA.push({
          id: focusAreaId,
          data: dataValuesFA[focusAreaId]
        });
      }
    });
    

    oldFA.forEach(fa => { 
      if (fa.data.includes('1. Care: Static Clinic')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[0],
          value: fa.data
        })
        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[0]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('2. Care: Outreach, mobile clinic, Community-based, delivery')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[1],
          value: fa.data
        })
        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[1]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('3. Care: Other Services, enabled or referred (associated clinics)')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[2],
          value: fa.data
        })
        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[2]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('4. Care: Social Marketing Services')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[3],
          value: fa.data
        })
        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[3]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('5. Care: Digital Health Intervention and Selfcare')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[4],
          value: fa.data
        })
        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[4]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('6. Advocacy')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[5],
          value: fa.data
        })

        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[5]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('7. CSE')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[6],
          value: fa.data
        })

        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[6]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('8. CSE Online, including social media')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[7],
          value: fa.data
        })

        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[7]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[8],
          value: fa.data
        })

        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[8]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[9],
          value: fa.data
        })

        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[9]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
      else if (fa.data.includes('11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures')) {
        newFA.push({
          dataElement: dataElements.projectFocusAreaNew[index].focusAreas[10],
          value: fa.data
        })

        if(fa.id!=dataElements.projectFocusAreaNew[index].focusAreas[10]) {
          newFA.push({
          dataElement: fa.id,
          value: ''
          })
        }
      }
    })
  };

  return newFA;
}


function loadCalculatedVariablesTI(
  dataValuesTI
) {
  var newTI = []
  dataElements.projectTotalIncome.forEach((pti,index) => {
    newTI[index] = {
      name: {
        dataElement: pti.subCategory,
        value:''
      },
      restricted: {
        dataElement: pti.restricted,
        value:''
      },
      unrestricted: {
        dataElement: pti.unrestricted,
        value:''
      }
    };
  })

  var oldTI = []
  dataElements.projectTotalIncome.forEach(pti=> {
    let valueObj = {
      subCategory: '',
      restricted: '',
      unrestricted: ''
    };
    if(dataValuesTI[pti.subCategory])  valueObj['subCategory'] = dataValuesTI[pti.subCategory];
    if(dataValuesTI[pti.restricted]) valueObj['restricted'] = dataValuesTI[pti.restricted];
    if(dataValuesTI[pti.unrestricted]) valueObj['unrestricted'] = dataValuesTI[pti.unrestricted];

    if(valueObj['subCategory']) oldTI.push(valueObj);
  })
  oldTI.forEach(ti => {
    if(ti.subCategory=="Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)") {
      newTI[0]['name']['value'] = "Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)";
      newTI[0]['restricted']['value'] = Number(ti.restricted) + Number(newTI[0]['restricted']['value']);
      newTI[0]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[0]['unrestricted']['value']);
    }
    if(ti.subCategory=="Client/Patient fees") {
      newTI[1]['name']['value']= "Client/Patient fees";
      newTI[1]['restricted']['value'] = Number(ti.restricted) + Number(newTI[1]['restricted']['value']);
      newTI[1]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[1]['unrestricted']['value']);
    }
    if(ti.subCategory=="Training, education, professional services and rentals") {
      newTI[2]['name']['value'] = "Training, education, professional services and rentals";
      newTI[2]['restricted']['value'] = Number(ti.restricted) + Number(newTI[2]['restricted']['value']);
      newTI[2]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[2]['unrestricted']['value']);
    }
    if(ti.subCategory=="Local/national: government") {
      newTI[3]['name']['value'] = "Local/national: government";
      newTI[3]['restricted']['value'] = Number(ti.restricted) + Number(newTI[3]['restricted']['value']);
      newTI[3]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[3]['unrestricted']['value']);
    }
    if(ti.subCategory=="Local/national: non-government") {
      newTI[4]['name']['value'] = "Local/national: non-government";
      newTI[4]['restricted']['value'] = Number(ti.restricted) + Number(newTI[4]['restricted']['value']);
      newTI[4]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[4]['unrestricted']['value']);
    }
    if(ti.subCategory=="Membership fees") {
      newTI[5]['name']['value'] = "Membership fees";
      newTI[5]['restricted']['value'] = Number(ti.restricted) + Number(newTI[5]['restricted']['value']);
      newTI[5]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[5]['unrestricted']['value']);
    }
    if(ti.subCategory=="Non-operational income") {
      newTI[6]['name']['value'] = "Non-operational income";
      newTI[6]['restricted']['value'] = Number(ti.restricted) + Number(newTI[6]['restricted']['value']);
      newTI[6]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[6]['unrestricted']['value']);
    }
    if(ti.subCategory=="Other national income") {
      newTI[7]['name']['value'] = "Other national income";
      newTI[7]['restricted']['value'] = Number(ti.restricted) + Number(newTI[7]['restricted']['value']);
      newTI[7]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[7]['unrestricted']['value']);
    }
    if(ti.subCategory=="Multilateral Agencies and Organizations") {
      newTI[8]['name']['value'] = "Multilateral Agencies and Organizations";
      newTI[8]['restricted']['value'] = Number(ti.restricted) + Number(newTI[8]['restricted']['value']);
      newTI[8]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[8]['unrestricted']['value']);
    }
    if(ti.subCategory=="Foreign Governments") {
      newTI[9]['name']['value'] = "Foreign Governments";
      newTI[9]['restricted']['value'] = Number(ti.restricted) + Number(newTI[9]['restricted']['value']);
      newTI[9]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[9]['unrestricted']['value']);
    }
    if(ti.subCategory=="International Trusts and Foundations / NGOs") {
      newTI[10]['name']['value']= "International Trusts and Foundations / NGOs";
      newTI[10]['restricted']['value'] = Number(ti.restricted) + Number(newTI[10]['restricted']['value']);
      newTI[10]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[10]['unrestricted']['value']);
    }
    if(ti.subCategory=="Corporate / Business Sector") {
      newTI[11]['name']['value']= "Corporate / Business Sector";
      newTI[11]['restricted']['value'] = Number(ti.restricted) + Number(newTI[11]['restricted']['value']);
      newTI[11]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[11]['unrestricted']['value']);
    }
    if(ti.subCategory=="Other International Income") {
      newTI[12]['name']['value'] = "Other International Income";
      newTI[12]['restricted']['value'] = Number(ti.restricted) + Number(newTI[12]['restricted']['value']);
      newTI[12]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[12]['unrestricted']['value']);
    }
    if(ti.subCategory=="IPPF Unrestricted Grant") {
      newTI[13]['name']['value'] = "IPPF Unrestricted Grant";
      newTI[13]['restricted']['value'] = Number(ti.restricted) + Number(newTI[13]['restricted']['value']);
      newTI[13]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[13]['unrestricted']['value']);
    }
    if(ti.subCategory=="IPPF Restricted Grant") {
      newTI[14]['name']['value'] = "IPPF Restricted Grant";
      newTI[14]['restricted']['value'] = Number(ti.restricted) + Number(newTI[14]['restricted']['value']);
      newTI[14]['unrestricted']['value'] = Number(ti.unrestricted) + Number(newTI[14]['unrestricted']['value']);
    }
  })
  return newTI;
}


function submitProjects() {
  alert("Data Saved Successfully!")
}