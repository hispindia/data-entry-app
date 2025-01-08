


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

  document
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchEvents();
    });

  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    fetchEvents(ev.target.value) 
  });



  async function fetchOrganizationUnitUid() {
    dataElements.period.value = document.getElementById("headerPeriod").value;

    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }

    var yearOptions = '';
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;

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
      if(!data) {
        data = await response.json();

        const userConfig = userGroupConfig(data)
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
      }

      if(window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-reporting').hide();
      }
      if(window.localStorage.getItem("hideReporting").includes('trt')) {
        $('.trt-review').hide();
      }
      if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-users').show();
      }
      if(window.localStorage.getItem("hideReporting").includes('core')) {
        $('.core-users').show();
      }

      if (data.organisationUnits && data.organisationUnits.length > 0) {
        tei.orgUnit = data.organisationUnits[0].id;
        document.getElementById("headerOrgId").value = data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name : '';

        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

        const fpaIndiaButton = document.querySelector('.fa-building-o').closest('a');
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector('div');
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;;
          }
        }
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {

    const year = document.getElementById("year-update").value;
    dataElements.period.value = document.getElementById("headerPeriod").value;

    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
      
      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == program.projectDescription || enroll.program == program.projectBudget || enroll.program == program.projectFocusArea || enroll.program == program.projectExpenseCategory ||program.auProjectDescription || enroll.program == program.auProjectBudget || enroll.program == program.auProjectFocusArea || enroll.program == program.auProjectExpenseCategory
        );

        var attributes = {};
        if (data.trackedEntityInstances.length && data.trackedEntityInstances[0].attributes) {
          data.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
        }
  
      var dataValuesPD,dataValuesPB,dataValuesPFA, dataValuesEC, dataValuesID, dataValuesCF, dataValuesTI, dataValuesNP, dataValuesOD = {};
        if(year==tei.year.start) {
          dataValuesOD =  getProgramStageEvents(filteredPrograms, programStage.membershipDetails, program.organisationDetails, dataElements.period.id) //data vlaues year wise
          if(dataValuesOD[`${tei.year.start} - ${tei.year.end}`]) dataValuesOD[tei.year.start] = dataValuesOD[`${tei.year.start} - ${tei.year.end}`];
          dataValuesNP =  getProgramStageEvents(filteredPrograms, programStage.narrativePlan, program.organisationDetails, dataElements.period.id) //data vlaues year wise
          if(dataValuesNP[`${tei.year.start} - ${tei.year.end}`]) dataValuesNP[tei.year.start] = dataValuesNP[`${tei.year.start} - ${tei.year.end}`];
           dataValuesPD = getEvents(filteredPrograms, program.projectDescription, dataElements.period.id);
           if(dataValuesPD[dataElements.period.value]) dataValuesPD[year] = dataValuesPD[dataElements.period.value];
           dataValuesPB = getEvents(filteredPrograms, program.projectBudget, dataElements.year.id);
           dataValuesPFA = getEvents(filteredPrograms, program.projectFocusArea, dataElements.year.id);
           dataValuesEC = getEvents(filteredPrograms, program.projectExpenseCategory, dataElements.year.id);
           dataValuesID = getProgramStageEvents(filteredPrograms, programStage.incomeByDonor, program.incomeDetails, dataElements.year.id);
           dataValuesCF = getProgramStageEvents(filteredPrograms, programStage.valueAddCoreFunding, program.incomeDetails, dataElements.year.id);
           dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.totalIncome, program.incomeDetails, dataElements.year.id);
        } else {
          dataValuesOD =  getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, dataElements.year.id) //data vlaues year wise
          dataValuesNP =  getProgramStageEvents(filteredPrograms, programStage.auNarrativePlan, program.auOrganisationDetails, dataElements.year.id) //data vlaues year wise
          dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, dataElements.year.id);
          dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget, dataElements.year.id);
          dataValuesPFA = getEvents(filteredPrograms, program.auProjectFocusArea, dataElements.year.id);
          dataValuesEC = getEvents(filteredPrograms, program.auProjectExpenseCategory, dataElements.year.id);
          dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auIncomeByDonor, program.auIncomeDetails, dataElements.year.id);
          dataValuesCF = getProgramStageEvents(filteredPrograms, programStage.auValueAddCoreFunding, program.auIncomeDetails, dataElements.year.id);
          dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id);
        }

      populateProgramEvents({
        attributes: attributes,
        organisationDetails: dataValuesOD,
        narrativePlan: dataValuesNP,
        projectDescription: dataValuesPD,
        projectBudget: dataValuesPB,
        projectFocusAreas: dataValuesPFA,
        projectExpenseCategory: dataValuesEC,
        projectIncomeDonor: dataValuesID,
        projectCoreFunding: dataValuesCF,
        projectTotalIncome: dataValuesTI,

      });
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dv) {

    const year = document.getElementById("year-update").value;
    const projectNames = checkProjects(dataElements.projectDescription, dv.projectDescription[year]);

    if (!projectNames.length) {
      alert('No Project Exist!');
    } else {
      //Table head
      var tableHead='';
      tableHead = `<tr><th colspan="4" style="font-weight:bold;text-align:center;background:#eef0ff">1.1 Organization Details</th></tr>`; 
      document.getElementById('th-project-organisationDetails').innerHTML = tableHead;

      tableHead='';
      tableHead = `<tr><th colspan="2" style="font-weight:bold;text-align:center;background:#eef0ff">1.2 Narrative Plan</th></tr><tr><th>Narrative Plan</th><th>Description</th></tr>`; 
      document.getElementById('th-project-narrativePlan').innerHTML = tableHead;

      var years = ''
      for (let year = tei.year.start; year <= tei.year.end; year++) years += `<th>Budget-${year}</th><th>Estimated likelihood-${year}</th><th>Amount of core funding allocated to projects-${year}</th>`

      tableHead = `<tr><th colspan="11" style="font-weight:bold;text-align:center;background:#eef0ff">2.2 Project Budget</th></tr><tr><th>S.No.</th><th>Project Name</th>${years}<th>Comments</th></tr>`; 
      document.getElementById('th-project-budget').innerHTML = tableHead;

      years = ''
      for (let year = tei.year.start; year <= tei.year.end; year++) years += `<th>${year}</th>`
      tableHead = `<tr><th colspan="8" style="font-weight:bold;text-align:center;background:#eef0ff">2.3 Budget by Focus Area</th></tr><tr><th>S.No.</th><th>Project Name</th><th>Focus Areas</th><th>Strategic Pillar</th>${years}<th>Comments</th></tr>`
      document.getElementById('th-project-focusArea').innerHTML = tableHead;

      tableHead = `<tr><th colspan="8" style="font-weight:bold;text-align:center;background:#eef0ff"> 2.4 Budget by Expense Category</th></tr><tr><th>Project Name</th><th>Expense Category</th>${years}<th>Comments</th></tr>`
      document.getElementById('th-project-expenseCategory').innerHTML = tableHead;

      tableHead = `<tr><th colspan="6" style="font-weight:bold;text-align:center;background:#eef0ff">3.2 Income by Donor</th></tr><tr><th>S.No.</th><th>Donor name</th>${years}<th>Comments</th></tr>`
      document.getElementById('th-project-incomeDonor').innerHTML = tableHead;

      tableHead = `<tr><th colspan="5" style="font-weight:bold;text-align:center;background:#eef0ff">3.3 Value Add of Core Funding</th></tr><tr><th>S.No.</th><th>Donor Details</th>${years}</tr>`
      document.getElementById('th-project-valueCoreFunding').innerHTML = tableHead;

      years = ''
      for (let year = tei.year.start; year <= tei.year.end; year++) years += `<th>Restricted-${year}</th><th>Unrestricted-${year}</th>`
      
      tableHead = `<tr><th colspan="8" style="font-weight:bold;text-align:center;background:#eef0ff">3.1 Total Income</th></tr><tr> <th>Income Type</th><th></th>${years}</tr>`
      document.getElementById('th-project-totalIncome').innerHTML = tableHead;
      
      //Table body
      var tableRows = '';

      tableRows = getOrganisationDetails(dv.attributes, dv.organisationDetails);
      document.getElementById('tb-project-organisationDetails').innerHTML = tableRows;

      tableRows = getNarrativePlan(dv.narrativePlan);
      document.getElementById('tb-project-narrativePlan').innerHTML = tableRows;

      tableRows = getProjectDescription(projectNames, dv.projectDescription[year], dataElements.projectDescription);
      document.getElementById('tb-project-description').innerHTML = tableRows;

      tableRows = getProjectBudget(projectNames, dv.projectBudget, dataElements.projectBudget);
      document.getElementById('project-budget').innerHTML = tableRows;

      tableRows = getProjectFocusAreas(projectNames, dv.projectFocusAreas, dataElements.projectFocusAreaNew);
      document.getElementById('project-focusArea').innerHTML = tableRows;

      tableRows = getProjectExpenseCategory(projectNames, dv.projectExpenseCategory, dataElements.projectExpenseCategory);
      document.getElementById('project-expenseCategory').innerHTML = tableRows;

      //Income Details
      tableRows = getIncomeDonor(dv.projectIncomeDonor, dataElements.incomeByDonor);
      document.getElementById('tb-project-incomeDonor').innerHTML = tableRows;

      tableRows = getValuesCoreFunding(dv.projectCoreFunding, dataElements.valuesCoreFunding);
      document.getElementById('tb-project-valueCoreFunding').innerHTML = tableRows;
      
      tableRows = getTotalIncome(dv.projectTotalIncome, dataElements.projectTotalIncome);
      document.getElementById('tb-project-totalIncome').innerHTML = tableRows;
      
    }
    
    // Localize content
    $('body').localize();

  }
  fetchOrganizationUnitUid();
});

function getOrganisationDetails(attr, dv) {
  var dataValues = {};
  const year = document.getElementById("year-update").value;
  if(attr) dataValues = {...attr};
  if(dv && dv[year]) dataValues = {...dataValues, ...dv[year]}
  return `
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Membership Details</td></tr>
  <tr><td>Country of Operation</td><td colspan="3">${dataValues['OgPuoRimaat']? dataValues['OgPuoRimaat']: ''}</td></tr>
  <tr><td>Organisation Code</td><td colspan="3">${dataValues['Lv8wUjXV8fl']? dataValues['Lv8wUjXV8fl']: ''}</td></tr>
  <tr><td>IPPF Region</td><td colspan="3">${dataValues['Nu5FHDVne91']? dataValues['Nu5FHDVne91']: ''}</td></tr>
  <tr><td>Organisation Name(English)</td><td colspan="3">${dataValues['H7u3oJh2ifa']? dataValues['H7u3oJh2ifa']: ''}</td></tr>
  <tr><td>Organisation name (original language)</td><td colspan="3">${dataValues['RUJcqfBvOSh']? dataValues['RUJcqfBvOSh']: ''}</td></tr>
  <tr><td>Primary contact person</td><td colspan="3">${dataValues['HrHPzD3Talq']? dataValues['HrHPzD3Talq']: ''}</td></tr>
  <tr><td>Business plan contact role</td><td colspan="3">${dataValues['LBF4RP0hzNR']? dataValues['LBF4RP0hzNR']: ''}</td></tr>
  <tr><td>Business plan Contact Email</td><td colspan="3">${dataValues['MgoVYQLP3yT']? dataValues['MgoVYQLP3yT']: ''}</td></tr>
  <tr><td>Formula-generated proposed grant amount (Year 1) (USD)</td><td colspan="3">${dataValues['fkHkH5jcJV0']? dataValues['fkHkH5jcJV0']: ''}</td></tr>
  <tr><td>Formula-generated proposed grant amount (Year 2) (USD)</td><td colspan="3">${dataValues['dhaMzFTSGrd']? dataValues['dhaMzFTSGrd']: ''}</td></tr>
  <tr><td>Provisional formula- generated grant amount (Year 3) (USD)</td><td colspan="3">${dataValues['gQQoxkZsZnn']? dataValues['gQQoxkZsZnn']: ''}</td></tr>
  <tr><td colspan="4" style="font-weight:bold;text-align:center"></td></tr>
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Contact Information</td></tr>
  <tr><td>Address</td><td colspan="3">${dataValues['eS8HHmy5krN']? dataValues['eS8HHmy5krN']: ''}</td></tr>
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Key Contacts</td></tr>
  <tr><td>Role</td><td>Name</td><td>Contact Email</td><td>Contact Phone</td></tr>
  <tr><td>Executive Director / CEO (or equivalent)</td><td>${dataValues['Ctp6kmhwq86']? dataValues['Ctp6kmhwq86']: ''}</td><td>${dataValues['yGutLB1Spaa']? dataValues['yGutLB1Spaa']: ''}</td><td>${dataValues['woWgpD819lF']? dataValues['woWgpD819lF']: ''}</td></tr>
  <tr><td>Board chair / President</td><td>${dataValues['IuyGw22tqYj']? dataValues['IuyGw22tqYj']: ''}</td><td>${dataValues['YTtJK3jqsnq']? dataValues['YTtJK3jqsnq']: ''}</td><td>${dataValues['CFF42nxFPgB']? dataValues['CFF42nxFPgB']: ''}</td></tr>
  <tr><td>Officer of the board #1 (e.g., vice president, secretary, treasurer)</td><td>${dataValues['BycCbaxB1Pu']? dataValues['BycCbaxB1Pu']: ''}</td><td>${dataValues['tt9p7BLGhT0']? dataValues['tt9p7BLGhT0']: ''}</td><td>${dataValues['Mzn08vVVZVt']? dataValues['Mzn08vVVZVt']: ''}</td></tr>
  <tr><td>Officer of the board #2 (e.g., vice president, secretary, treasurer)</td><td>${dataValues['MeCYmsrREyS']? dataValues['MeCYmsrREyS']: ''}</td><td>${dataValues['qShxfRboswE']? dataValues['qShxfRboswE']: ''}</td><td>${dataValues['XmDKyaE5SbW']? dataValues['XmDKyaE5SbW']: ''}</td></tr>
  <tr><td>Officer of the board #3 (e.g., vice president, secretary, treasurer)</td><td>${dataValues['QgqjdnD1a24']? dataValues['QgqjdnD1a24']: ''}</td><td>${dataValues['QoFEoEFiPZd']? dataValues['QoFEoEFiPZd']: ''}</td><td>${dataValues['H2t9gnU6JKb']? dataValues['H2t9gnU6JKb']: ''}</td></tr>
  <tr><td>Youth board member</td><td>${dataValues['aA5UkYBNvbl']? dataValues['aA5UkYBNvbl']: ''}</td><td>${dataValues['k86jH9sSXSq']? dataValues['k86jH9sSXSq']: ''}</td><td>${dataValues['oYpc136YNgW']? dataValues['oYpc136YNgW']: ''}</td></tr>
  <tr><td>Programmatic lead(s)</td><td>${dataValues['HFyJ2WGQEda']? dataValues['HFyJ2WGQEda']: ''}</td><td>${dataValues['qColDnIqDjT']? dataValues['qColDnIqDjT']: ''}</td><td>${dataValues['vFhnYZHTxfr']? dataValues['vFhnYZHTxfr']: ''}</td></tr>
  <tr><td>Programmatic lead(s)</td><td>${dataValues['t9LCankavyt']? dataValues['t9LCankavyt']: ''}</td><td>${dataValues['sJpc63Pkpip']? dataValues['sJpc63Pkpip']: ''}</td><td>${dataValues['SDC9mqvdjhQ']? dataValues['SDC9mqvdjhQ']: ''}</td></tr>
  <tr><td>Programmatic lead(s)</td><td>${dataValues['SmJKIYmyAVC']? dataValues['SmJKIYmyAVC']: ''}</td><td>${dataValues['GZAulWuoial']? dataValues['GZAulWuoial']: ''}</td><td>${dataValues['dUnjPtPImoY']? dataValues['dUnjPtPImoY']: ''}</td></tr>
  <tr><td>Programmatic lead(s)</td><td>${dataValues['uYz5iheRYPO']? dataValues['uYz5iheRYPO']: ''}</td><td>${dataValues['X82L6C9yiZB']? dataValues['X82L6C9yiZB']: ''}</td><td>${dataValues['VXCYfrSNS8J']? dataValues['VXCYfrSNS8J']: ''}</td></tr>
  <tr><td>Finance lead</td><td>${dataValues['ptHCVnzUXQl']? dataValues['ptHCVnzUXQl']: ''}</td><td>${dataValues['lea8lybuFI9']? dataValues['lea8lybuFI9']: ''}</td><td>${dataValues['PZswZ4XFTku']? dataValues['PZswZ4XFTku']: ''}</td></tr>
  <tr><td>Current board term: Start year</td><td colspan="3">${dataValues['nME0H9rEBz4']? dataValues['nME0H9rEBz4']: ''}</td></tr>
  <tr><td>Current board term: End year</td><td colspan="3">${dataValues['leqtpPX6o97']? dataValues['leqtpPX6o97']: ''}</td></tr>
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Organisation Data</td></tr>
  <tr><td>Stragegic period: start year</td><td colspan="3">${dataValues['bcrC5FlhCrh']? dataValues['bcrC5FlhCrh']: ''}</td></tr>
  <tr><td>Stragegic period: end year</td><td colspan="3">${dataValues['pJpPTx4wJcL']? dataValues['pJpPTx4wJcL']: ''}</td></tr>
  <tr><td>Total Number of Fixed Staff (paid staff on a contract)</td><td  colspan="3">${dataValues['kovn3d3f6S3']? dataValues['kovn3d3f6S3']: ''}</td></tr>
  <tr><td>Total Number of volunteers (excluding governance)</td><td colspan="3">${dataValues['CblclJFFlfV']? dataValues['CblclJFFlfV']: ''}</td></tr>
  <tr><td>Type of organisation</td><td colspan="3">${dataValues['KfenFbGtZsj']? dataValues['KfenFbGtZsj']: ''}</td></tr>
  <tr><td>What is your primary focus area (choose most relevant)</td><td colspan="3">${dataValues['zdWqftJFqGA']? dataValues['zdWqftJFqGA']: ''}</td></tr>
  <tr><td>What is your secondary focus area (chose most relevant)</td><td colspan="3">${dataValues['TKYN8eltlPO']? dataValues['TKYN8eltlPO']: ''}</td></tr>
  <tr><td>Does your organisation have a youth group or networks?</td><td colspan="3">${dataValues['ttOZ4zaMXji']? dataValues['ttOZ4zaMXji']: ''}</td></tr>
  <tr><td>If yes, how many youth volunteers do you have?</td><td colspan="3">${dataValues['dQgZIHO74q5']? dataValues['dQgZIHO74q5']: ''}</td></tr>
  <tr><td>Does the MA have branches?</td><td colspan="3">${dataValues['UaETNe6k15k']? dataValues['UaETNe6k15k']: ''}</td></tr>
  <tr><td>If yes, number of branches</td><td colspan="3">${dataValues['OvbPe9nCJOd']? dataValues['OvbPe9nCJOd']: ''}</td></tr>
  <tr><td>Advocacy priority 1 (choose most relevant)</td><td colspan="3">${dataValues['ruUgWVq48ke']? dataValues['ruUgWVq48ke']: ''}</td></tr>
  <tr><td>Advocacy priority 2 (choose most relevant)</td><td colspan="3">${dataValues['AqNCKTl9iU9']? dataValues['AqNCKTl9iU9']: ''}</td></tr>`
}

function getNarrativePlan(dv) {
  const year = document.getElementById("year-update").value;
  const dataElements= [{
    id: "oizxXuGwWLL",
    name: "Ques 1. Country context"
  },{
    id: "rdPScQ5GgKU",
    name: "Ques 2. Strategy"
  },{
    id: "WEEnixroVKY",
    name: "Ques 3. Landscape of other actors"
  },{
    id: "ztUH9mj80pm",
    name: "Ques 4. External risks and risk mitigation"
  },{
    id: "LXfgbwQkr4C",
    name: "Ques 5. Youth Leadership and Involvement"
  },{
    id: "oPTJLbFbSrJ",
    name: "Institutional Challenges"
  },{
    id: "KmDJkDxCeea",
    name: "Institutional Opportunities"
  },{
    id: "tVPMPLrlgq7",
    name: "Operational Challenges"
  },{
    id: "jtXBm7oOiSz",
    name: "Operational Opportunities"
  },{
    id: "LZF0jI0gnbW",
    name: "Programmatic Challenges"
  },{
    id: "HY09p2Ew4mW",
    name: "Programmatic Opportunities"
  },{
    id: "QPwGbiCY17X",
    name: "Financial challenges"
  },{
    id: "KfAuY7fykAe",
    name: "Financial opportunities"
  },{
    id: "Y9qKLtXelUY",
    name: "Sustainability challenges"
  },{
    id: "VRKVQaLyuS2",
    name: "Sustainability opportunities"
  },{
    id: "gPcHDHG57PU",
    name: "What capacity does my organisation have than they are able to share with other MAs?"
  },{
    id: "l43075Zt8rA",
    name: "Wht are your main capacity support needs from the federation (please be specific)"
  }];

  var tableRows = '';
  dataElements.forEach(de => {
    tableRows += `<tr><td>${de.name}</td><td>${dv[year] && dv[year][de.id]? dv[year][de.id]: ''}</td></tr>`
  })
  return tableRows;

}
function getProjectDescription(names, dv, deIds) {
  var tableRows = '';
  names.forEach((_, index) => {
    tableRows += `<tr>
    <td>${(index+1)}</td>
    <td>${dv[deIds[index].name] ? dv[deIds[index].name] : ''}</td>
    <td>${dv[deIds[index].description] ? dv[deIds[index].description] : ''}</td>
    </tr>`
  })
  return tableRows;
}

function getProjectBudget(names, dv, deIds) {
  var tableRows = '';
  names.forEach((_, index) => {
    tableRows += `<tr>
    <td>${index+1}</td>
    <td>${dv[tei.year.start] && dv[tei.year.start][deIds[index].name] ? dv[tei.year.start][deIds[index].name] : ''}</td>`
    for (let year = tei.year.start; year <= tei.year.end; year++) {
      tableRows += `<td>${dv[year] && dv[year][deIds[index].budget] ? dv[year][deIds[index].budget] : ''}</td>
      <td>${dv[year] && dv[year][deIds[index].likelihood] ? dv[year][deIds[index].likelihood] : ''}</td>
      <td>${dv[year] && dv[year][deIds[index].funding] ? dv[year][deIds[index].funding] : ''}</td>`
    }    
    tableRows += `<td>${dv[tei.year.start] && dv[tei.year.start][deIds[index].comment] ? dv[tei.year.start][deIds[index].comment] : ''}</td>
    </tr>`
  })
  return tableRows;
}


function getProjectFocusAreas(names, dv, deIds) {
  var tableRows = '';
  names.forEach((_, index) => {
    var areas = [];
    deIds[index].focusAreas.forEach(fa => {

      var rows = ''
      var values = [];
      var area = '';
      var pillar = '';
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if (dv[year][fa]) {
          const focusArea = JSON.parse(dv[year][fa]);
          if (focusArea.area) area = focusArea.area;
          if (focusArea.pillar) pillar = focusArea.pillar;
          values.push(focusArea.budget ? displayValue(focusArea.budget) : '');
        }
      }
      if (area) {
        rows += `<td>${area}</td><td>${pillar}</td>`;
        values.forEach(val => rows += `<td>${val}</td>`);
        areas.push(rows);
      }
    })
    areas.forEach((area, index1) => {
      if (index1 == 0) tableRows += `<tr><td rowspan=${areas.length}>${index+1}</td><td rowspan=${areas.length}>${dv[tei.year.start][deIds[index].name] ? dv[tei.year.start][deIds[index].name] : ''}</td>${area}<td rowspan=${areas.length}>${dv[tei.year.start] && dv[tei.year.start][deIds[index].comment] ? dv[tei.year.start][deIds[index].comment] : ''}</td></tr>`;
      else tableRows += `<tr>${area}</tr>`;
    })
  })
  return tableRows;
}

function getProjectExpenseCategory(names, dv, deIds) {
  var tableRows = ''

  names.forEach((_, index) => {
    var personnel = [];
    var activities = [];
    var commodities = [];
    var cost = [];
    for (let year = tei.year.start; year <= tei.year.end; year++) {
      personnel.push(`<td>${dv[year] && dv[year][deIds[index].personnel] ? displayValue(dv[year][deIds[index].personnel]) : ''}</td>`);
      activities.push(`<td>${dv[year] && dv[year][deIds[index].activities] ? displayValue(dv[year][deIds[index].activities]) : ''}</td>`);;
      commodities.push(`<td>${dv[year] && dv[year][deIds[index].commodities] ? displayValue(dv[year][deIds[index].commodities]) : ''}</td>`);;
      cost.push(`<td>${dv[year] && dv[year][deIds[index].cost] ? displayValue(dv[year][deIds[index].cost]) : ''}</td>`);
    }
    
    tableRows += `<tr><td>${dv[tei.year.start] && dv[tei.year.start][deIds[index].name] ? dv[tei.year.start][deIds[index].name] : ''}</td><td>Personnel</td>${personnel.join('')}<td rowspan="4">${dv[tei.year.start] && dv[tei.year.start][deIds[index].comment] ? dv[tei.year.start][deIds[index].comment] : ''}</td> </tr>
    <tr><td>${dv[tei.year.start] && dv[tei.year.start][deIds[index].name] ? dv[tei.year.start][deIds[index].name] : ''}</td><td>Direct Project Activities</td>${activities.join('')}</tr>
    <tr><td>${dv[tei.year.start] && dv[tei.year.start][deIds[index].name] ? dv[tei.year.start][deIds[index].name] : ''}</td><td>Commodities</td>${commodities.join('')}</tr>
    <tr><td>${dv[tei.year.start] && dv[tei.year.start][deIds[index].name] ? dv[tei.year.start][deIds[index].name] : ''}</td><td>Indirect/ support costs</td>${cost.join('')}</tr>`
  })
  return tableRows;
}

function getIncomeDonor(dv, deIds) {
  var tableRows = '';
  var count = 0;
  deIds.forEach((ids) => {
    if(dv[tei.year.start] && dv[tei.year.start][ids.name]) {

      tableRows += `<tr><td>${++count}</td><td>${ dv[tei.year.start] && dv[tei.year.start][ids.name] ? dv[tei.year.start][ids.name]: ''}</td>`;
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        tableRows += `<td>${dv[year] && dv[year][ids.income] ? displayValue(dv[year][ids.income]): ''}</td>`
      }
      tableRows += `<td>${ dv[tei.year.start] && dv[tei.year.start][ids.comments] ? dv[tei.year.start][ids.comments]: ''}</td></tr>`;
    } 
  
  })
  return tableRows;

}

function getValuesCoreFunding(dv, deIds) {
  var tableRows = '';
  var count = 0;
  deIds.donors.forEach((ids) => {
    if(dv[tei.year.start] && dv[tei.year.start][ids.name]) {

      tableRows += `<tr><td>${++count}</td><td>${ dv[tei.year.start] && dv[tei.year.start][ids.name] ? dv[tei.year.start][ids.name]: ''}</td>`;
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        tableRows += `<td>${dv[year] && dv[year][ids.amountLocked] ? displayValue(dv[year][ids.amountLocked]): ''}</td>`
      }
      tableRows += `</tr>`;
    } 
  
  })
  return tableRows;

}

function getTotalIncome(dv, deIds) {
  const categoryIncome = [
    {
      name: "Locally generated income",
      code: "Locally generated income",
      id: "AwylsBWgOEK",
      format: 'locally-generated',
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
      format: 'international-income',
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
      format: 'ippf-income',
      options: [
        {
          "name": "IPPF Unrestricted Grant",
          "code": "IPPF Unrestricted Grant",
          "id": "D0YD3aNWqGp",
          format: "ippf-unrestricted"
        },
        {
          "name": "IPPF Restricted Grant",
          "code": "IPPF Restricted Grant",
          "id": "fOsunx90DGG",
          format: "ippf-restricted"
        }
      ],
    },
  ];
  var tableBody=''
  categoryIncome.forEach(categ => {
    tableBody += `<tr><td rowspan="${categ.options.length}">${categ.name}</td>`;
    categ.options.forEach((option,index) => {
      if(index==0) tableBody += `<td>${option.name}</td>`;
      else tableBody += `<tr><td>${option.name}</td>`;
        for (let year = tei.year.start; year <= tei.year.end; year++) {
          var res = '';
          var unres = '';
          deIds.forEach(ids => {
            if(dv[year] && dv[year][ids.category]==categ.code && dv[year][ids.subCategory]==option.code) {
              res = Number(res) +  (dv[year][ids.restricted] ? Number(dv[year][ids.restricted]): 0);
              unres = Number(unres) + (dv[year][ids.unrestricted] ? Number(dv[year][ids.unrestricted]): 0);
             }
          })
          tableBody += `<td>${displayValue(res)}</td><td>${displayValue(unres)}</td>`
        
        }
      
      tableBody += `</td>`
    })
  })
  return tableBody;

}


function displayValue(input) {
  let num = typeof input === "string" ? parseFloat(input) : input;
 
  if (isNaN(num)) {
      return "";
  }
 
  if (num % 1 === 0) {
     return num.toString();
  } else {
     return num.toFixed(2);
  }
 }

function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names = [];
  if (values) {
    projects.forEach(project => {
      if (values[project.name]) {
        names = [...names, ...prevEmptyNames, project.name];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}

