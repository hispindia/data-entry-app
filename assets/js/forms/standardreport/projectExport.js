import { dataSet } from '../../api/dataSet.js';
import { getEvents, getProgramStageEvents, getTEI } from '../../api/func.js';
import { tei, dataElements, program, programStage, dataSetPrice, dataSetQuantity, dataSetFunds } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears } from '../func.js';

var freightCostT1 = 1;
var freightCostT2 =  0.4;
var freightCostT3 = 0.25;

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
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    fetchEvents(ev.target.value) 
    $('.loader-container').addClass("d-flex").removeClass("d-none");
    $('.myContainer').hide();
  });

    async function configurePage() {
      const user = await getUserConfig();
      tei.disabled = user.disabled;
  
      if (user.organisationUnits?.length) {
        tei.orgUnit = user.organisationUnits[0].id;
        if (user.organisationUnits[0].parent) {
          document.getElementById("headerOrgId").value = user.organisationUnits[0].parent.name;
        }
        document.getElementById("facility").innerHTML = user.organisationUnits[0].name;
        document.getElementById("headerOrgName").value = user.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value = user.organisationUnits[0].code;   
      }
          
      if(user.hideReporting.includes('aoc')) {
        $(`.aoc-users`).show();
      } else $(`.aoc-users`).hide();

      if(user.hideReporting.includes('trt')) {
        $(`.trt-users`).show();
      } else $(`.trt-users`).hide();
            
      if(user.hideReporting.includes('core')) {
        $('.core-users').show();
      }
          
      if(user.hideReporting.includes('ma')) {
        $('.ma-users').show();
      }
            
      if(user.annualReporting) {
        document.getElementById('reporting-periodicity').value = user.annualReporting;
      }
  
      const years = getYears(tei.year.start, tei.year.end);
      document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
      if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

      tei.program = program.arOrganisationDetails;
      tei.programStage = programStage.arMembershipDetails;
      
      fetchEvents();    
  }

  async function fetchEvents() {
    
  tei.year.value = document.getElementById("year-update").value;
  
    const data = await getTEI(tei.orgUnit);
    const dataSet = await fetchDataSet(tei.year.value);
    if(dataSet.values[dataElements.freightCost1]) freightCostT1 = Number(dataSet.values[dataElements.freightCost1]);
    if(dataSet.values[dataElements.freightCost2]) freightCostT2 = Number(dataSet.values[dataElements.freightCost2]);
    if(dataSet.values[dataElements.freightCost3]) freightCostT3 = Number(dataSet.values[dataElements.freightCost3]);
    
    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
      // console.log("TEI enrollments:", data.trackedEntityInstances[0].enrollments);

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == program.projectDescription || enroll.program == program.projectBudget || enroll.program == program.projectFocusArea || enroll.program == program.projectExpenseCategory ||program.auProjectDescription || enroll.program == program.auProjectBudget || enroll.program == program.auProjectFocusArea || enroll.program == program.auProjectExpenseCategory
        ); 
        // console.log("filtered Programs for the selected year: ", filteredPrograms);

        var attributes = {};
        if (data.trackedEntityInstances.length && data.trackedEntityInstances[0].attributes) {
          data.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
        }
  
        var dataValuesPD,dataValuesPB,dataValuesPFA, dataValuesEC, dataValuesID, dataValuesCF, dataValuesTI, dataValuesNP, dataValuesOD, dataValuesCS, dataValuesOC = {};
        if(tei.year.value == tei.year.start) {

          dataValuesOD =  getProgramStageEvents(filteredPrograms, programStage.membershipDetails, program.organisationDetails, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
          if(dataValuesOD[`${tei.year.start} - ${tei.year.end}`]) dataValuesOD[tei.year.start] = dataValuesOD[`${tei.year.start} - ${tei.year.end}`];
          
          dataValuesNP =  getProgramStageEvents(filteredPrograms, programStage.narrativePlan, program.organisationDetails, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
          if(dataValuesNP[`${tei.year.start} - ${tei.year.end}`]) dataValuesNP[tei.year.start] = dataValuesNP[`${tei.year.start} - ${tei.year.end}`];
          dataValuesPD = getEvents(filteredPrograms, program.projectDescription, {id: tei.year.id, value: tei.year.value});
           dataValuesPB = getEvents(filteredPrograms, program.projectBudget, {id: tei.year.id, value: tei.year.value});
           dataValuesPFA = getEvents(filteredPrograms, program.projectFocusArea, {id: tei.year.id, value: tei.year.value});
           dataValuesEC = getEvents(filteredPrograms, program.projectExpenseCategory, {id: tei.year.id, value: tei.year.value});
           dataValuesID = getProgramStageEvents(filteredPrograms, programStage.incomeByDonor, program.incomeDetails, {id: tei.year.id, value: tei.year.value});
           dataValuesCF = getProgramStageEvents(filteredPrograms, programStage.valueAddCoreFunding, program.incomeDetails, {id: tei.year.id, value: tei.year.value});
           dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.totalIncome, program.incomeDetails, {id: tei.year.id, value: tei.year.value});
        } else {
          dataValuesOD =  getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
          dataValuesNP =  getProgramStageEvents(filteredPrograms, programStage.auNarrativePlan, program.auOrganisationDetails, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
          dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id: tei.year.id, value: tei.year.value});
          dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget, {id: tei.year.id, value: tei.year.value});
          dataValuesPFA = getEvents(filteredPrograms, program.auProjectFocusArea, {id: tei.year.id, value: tei.year.value});
          dataValuesEC = getEvents(filteredPrograms, program.auProjectExpenseCategory, {id: tei.year.id, value: tei.year.value});
          dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auIncomeByDonor, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value});
          dataValuesCF = getProgramStageEvents(filteredPrograms, programStage.auValueAddCoreFunding, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value});
          dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value});
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
        dataSet

      });
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function 
  populateProgramEvents(dv) {

    const projectNames = checkProjects(dataElements.projectDescription, dv.projectDescription[tei.year.value]);

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

      tableHead = `<tr><th colspan="11" style="font-weight:bold;text-align:center;background:#eef0ff">2.2 Project Expense Budget</th></tr><tr><th rowspan="2">S.No.</th><th rowspan="2">Project Name</th><th colspan="4" style="text-align:center">${tei.year.value}</th><th rowspan="2">Comments</th></tr><tr><th>Basic Project Budget</th><th>IPPF Core Funding Allocated</th><th>Total Annual Budget</th><th>Estimated Likelihood</th></tr>`; 
      document.getElementById('th-project-budget').innerHTML = tableHead;

      tableHead = `<tr><th colspan="8" style="font-weight:bold;text-align:center;background:#eef0ff">2.3 Expense Budget by Focus Area</th></tr><tr><th>S.No.</th><th>Project Name</th><th>Focus Areas</th><th>Strategic Pillar</th><th>${tei.year.value}</th><th>Comments</th></tr>`
      document.getElementById('th-project-focusArea').innerHTML = tableHead;

      tableHead = `<tr><th colspan="8" style="font-weight:bold;text-align:center;background:#eef0ff"> 2.4 Budget by Expense Category</th></tr><tr><tr><th rowspan="2">S.No.</th><th rowspan="2">Project Name</th><th colspan="4" style="text-align:center;">${tei.year.value}</th><th rowspan="2">Comments</th></tr><tr><th>Personnel</th><th>Direct project activities</th><th>Commodities</th><th>Indirect/ support costs</th></tr>`
      document.getElementById('th-project-expenseCategory').innerHTML = tableHead;

      tableHead = `<tr><th colspan="6" style="font-weight:bold;text-align:center;background:#eef0ff">3.2 Income by Donor</th></tr><tr><th>S.No.</th><th>Donor name</th><th>${tei.year.value}</th><th>Comments</th></tr>`
      document.getElementById('th-project-incomeDonor').innerHTML = tableHead;

      tableHead = `<tr><th colspan="5" style="font-weight:bold;text-align:center;background:#eef0ff">3.3 Value Add of Core Funding</th></tr><tr><th>S.No.</th><th>Donor Details</th><th>${tei.year.value}</th></tr>`
      document.getElementById('th-project-valueCoreFunding').innerHTML = tableHead;

      tableHead = `<tr><th colspan="8" style="font-weight:bold;text-align:center;background:#eef0ff">3.1 Total Income</th></tr><tr> <th>Income Type</th><th></th><th>${tei.year.value}</th></tr>`
      document.getElementById('th-project-totalIncome').innerHTML = tableHead;
      

      tableHead = `<tr><th style="font-weight:bold;text-align:center;background:#eef0ff" colspan="9">Order Commodities from IPPF</th></tr>`
      document.getElementById('th-project-orderCommodities').innerHTML = tableHead;

      tableHead = `<tr><th style="font-weight:bold;text-align:center;background:#eef0ff" colspan="2">Commodities by Funding Source</th></tr>`
      document.getElementById('th-project-commoditiesSource').innerHTML = tableHead;

      //Table body
      var tableRows = '';

      tableRows = getOrganisationDetails(dv.attributes, dv.organisationDetails, (dv.dataSet.values?dv.dataSet.values:{}), tei.year.value);
      document.getElementById('tb-project-organisationDetails').innerHTML = tableRows;

      tableRows = getNarrativePlan((dv.narrativePlan[tei.year.value]?dv.narrativePlan[tei.year.value]:{}));
      document.getElementById('tb-project-narrativePlan').innerHTML = tableRows;

      tableRows = getProjectDescription(projectNames, (dv.projectDescription[tei.year.value]?dv.projectDescription[tei.year.value]:{}), dataElements.projectDescription);
      document.getElementById('tb-project-description').innerHTML = tableRows;

      tableRows = getProjectBudget(projectNames, (dv.projectBudget[tei.year.value] ? dv.projectBudget[tei.year.value] : {}), dataElements.projectBudget);
      document.getElementById('project-budget').innerHTML = tableRows;

      tableRows = getProjectFocusAreas(projectNames, (dv.projectFocusAreas[tei.year.value] ? dv.projectFocusAreas[tei.year.value]: {}), dataElements.projectFocusAreaNew);
      document.getElementById('project-focusArea').innerHTML = tableRows;

      tableRows = getProjectExpenseCategory(projectNames, (dv.projectExpenseCategory[tei.year.value] ? dv.projectExpenseCategory[tei.year.value] : {}), dataElements.projectExpenseCategory);
      document.getElementById('project-expenseCategory').innerHTML = tableRows;

      // Income Details
      tableRows = getIncomeDonor((dv.projectIncomeDonor[tei.year.value]?dv.projectIncomeDonor[tei.year.value]:{}), dataElements.incomeByDonor);
      document.getElementById('tb-project-incomeDonor').innerHTML = tableRows;

      tableRows = getValuesCoreFunding((dv.projectCoreFunding[tei.year.value]?dv.projectCoreFunding[tei.year.value]:{}), dataElements.valuesCoreFunding);
      document.getElementById('tb-project-valueCoreFunding').innerHTML = tableRows;
      
      tableRows = getTotalIncome((dv.projectTotalIncome[tei.year.value]?dv.projectTotalIncome[tei.year.value]:{}), dataElements.projectTotalIncome);
      document.getElementById('tb-project-totalIncome').innerHTML = tableRows;

      tableRows = getOrderCommodities(dv.dataSet);
      document.getElementById('tb-project-orderCommodities').innerHTML = tableRows;

      tableRows = getCommoditiesSource(dv.dataSet.values);
      document.getElementById('tb-project-commoditiesSource').innerHTML = tableRows;
      
    }
    $('.loader-container').addClass("d-none").removeClass("d-flex");
    $('.myContainer').show();
    // Localize content
    $('body').localize();

  }
  configurePage();
});

function getOrganisationDetails(attr, dv, dataSet, year) {
  var dataValues = {};
  if(attr) dataValues = {...attr};
  if(dv[year]) dataValues = {...dataValues, ...dv[year]}
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
  <tr><td>Formula-generated proposed grant amount (USD)</td><td colspan="3">${dataSet[dataElements.formulaGenerated]? formatNumberInput(dataSet[dataElements.formulaGenerated]): ''}</td></tr>
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
    id: "ifM2Ah6sJ0C",
    name: "SMART Outcomes 1"
  },{
    id: "aJukhBePNFi",
    name: "SMART Outcomes 2"
  },{
    id: "tF3wu8UCNZN",
    name: "SMART Outcomes 3"
  },{
    id: "IFGhCtqEcG9",
    name: "SMART Outcomes 4"
  },{
    id: "BqUHx7fA9Of",
    name: "SMART Outcomes 5"
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
    id: "Isf6HLsoA8C",
    name: "Main Technical Assistance / Capacity 1"
  },{
    id: "kkZnSBQ4vTm",
    name: "Main Technical Assistance / Capacity 2"
  },{
    id: "inLkozA03Gy",
    name: "Main Technical Assistance / Capacity 3"
  },{
    id: "j18ZP7aMnFl",
    name: "Main Technical Assistance / Capacity 4"
  },{
    id: "UjfWJQKImNx",
    name: "Main Technical Assistance / Capacity 5"
  },{
    id: "HtIAWk0c0q2",
    name: "Organisational Areas of Expertise / Capacity 1"
  },{
    id: "ospBjbSOXvH",
    name: "Organisational Areas of Expertise / Capacity 2"
  },{
    id: "gvvbtUPR9Vw",
    name: "Organisational Areas of Expertise / Capacity 3"
  },{
    id: "Adll8J3sUFS",
    name: "Organisational Areas of Expertise / Capacity 4"
  },{
    id: "NGUGDJcGpoU",
    name: "Organisational Areas of Expertise / Capacity 5"
  },{
    id: "wc87Aa1VKsn",
    name: "Other"
  }];

  var tableRows = '';
  dataElements.forEach(de => {
    tableRows += `<tr><td>${de.name}</td><td>${dv[de.id] ? dv[de.id] : ''}</td></tr>`
  })
  return tableRows;

}
function getProjectDescription(names, dv, deIds) {
  var tableRows = '';
  names.forEach((_, index) => {
    tableRows += `<tr>
    <td rowspan="10">${(index+1)}</td>
    <td rowspan="10">${dv[deIds[index].name] ? dv[deIds[index].name] : ''}</td>
    <td>Start Date</td>
    <td>${dv[deIds[index].startDate] ? dv[deIds[index].startDate] : ''}</td>
    </tr>
    <tr><td>End Date</td><td>${dv[deIds[index].endDate] ? dv[deIds[index].endDate] : ''}</td></tr>
    <tr><td>Project Theme</td><td>${dv[deIds[index].theme] ? dv[deIds[index].theme] : ''}</td>
    <tr><td>Project Theme (other)</td><td>${dv[deIds[index].themeOther] ? dv[deIds[index].themeOther] : ''}</td>
    <tr><td>Project Donor</td><td>${dv[deIds[index].donor] ? dv[deIds[index].donor] : ''}</td>
    <tr><td>Project Donor (Other)</td><td>${dv[deIds[index].donorOther] ? dv[deIds[index].donorOther] : ''}</td>
    <tr><td>Funding Type</td><td>${dv[deIds[index].funding] ? dv[deIds[index].funding] : ''}</td>
    <tr><td>Annual Project Income</td><td>${dv[deIds[index].income] ? dv[deIds[index].income] : ''}</td>
    <tr><td>Total Contract Value</td><td>${dv[deIds[index].contract] ? dv[deIds[index].contract] : ''}</td>
    <tr><td>Project Description</td><td>${dv[deIds[index].description] ? dv[deIds[index].description] : ''}</td>
    </tr>`
  })
  return tableRows;
}

function getProjectBudget(names, dv, deIds) {
  var tableRows = '';
  names.forEach((_, index) => {
    tableRows += `<tr>
    <td>${index+1}</td>
    <td>${dv[deIds[index].name] ? dv[deIds[index].name] : ''}</td>
    <td>${dv[deIds[index].donor] ? formatNumberInput(dv[deIds[index].donor]) : ''}</td>
    <td>${dv[deIds[index].funding] ? formatNumberInput(dv[deIds[index].funding]) : ''}</td>
    <td>${dv[deIds[index].budget] ? formatNumberInput(dv[deIds[index].budget]) : ''}</td>
    <td>${dv[deIds[index].likelihood] ? dv[deIds[index].likelihood] : ''}</td>
    <td>${dv[deIds[index].comment] ? dv[deIds[index].comment] : ''}</td>
    </tr>`
  })
  return tableRows;
}


function getProjectFocusAreas(names, dv, deIds) {
  var tableRows = '';
  var totalBudget = 0;
  names.forEach((_, index) => {
    var areas = []
    deIds[index].focusAreas.forEach(fa => {
        if (dv[fa]) {
          const focusArea = JSON.parse(dv[fa]);
          const budget = focusArea.budget ?  focusArea.budget: '';
          areas.push(`<td>${focusArea.area}</td><td>${focusArea.pillar}</td><td>${formatNumberInput(displayValue(budget))}</td>`);
          totalBudget += Number(budget);
        }
    })
    
    areas.forEach((area, index1) => {
      if (index1 == 0) tableRows += `<tr><td rowspan=${areas.length}>${index+1}</td><td rowspan="${areas.length}">${dv[deIds[index].name] ? dv[deIds[index].name] : ''}</td>${area}<td rowspan="${areas.length}">${dv[deIds[index].comment] ? dv[deIds[index].comment] : ''}</td></tr>`;
      else tableRows += `<tr>${area}</tr>`;
    })
  })
  tableRows += `<tr><td style="font-weight:bold" colspan="4">Totals</td><td style="font-weight:bold" colspan="2">${formatNumberInput(displayValue(totalBudget))}</td></tr>`;
  return tableRows;
}

function getProjectExpenseCategory(names, dv, deIds) {
  var tableRows = ''
  var totalBudget = 0;
  names.forEach((_, index) => {
    tableRows += `<tr>
    <td>${index+1}</td>
    <td>${dv[deIds[index].name] ? dv[deIds[index].name] : ''}</td>
    <td>${dv[deIds[index].personnel] ? formatNumberInput(displayValue(dv[deIds[index].personnel])) : ''}</td>
    <td>${dv[deIds[index].activities] ? formatNumberInput(displayValue(dv[deIds[index].activities])) : ''}</td>
    <td>${dv[deIds[index].commodities] ? formatNumberInput(displayValue(dv[deIds[index].commodities])) : ''}</td>
    <td>${dv[deIds[index].cost] ? formatNumberInput(displayValue(dv[deIds[index].cost])) : ''}</td>
    <td>${dv[deIds[index].comment] ? dv[deIds[index].comment] : ''}</td>
    </tr>`
    totalBudget += ((dv[deIds[index].personnel]? Number(dv[deIds[index].personnel]): 0) + (dv[deIds[index].activities]? Number(dv[deIds[index].activities]): 0) + (dv[deIds[index].commodities]? Number(dv[deIds[index].commodities]): 0) + (dv[deIds[index].cost]? Number(dv[deIds[index].cost]): 0))
  })
  tableRows += `<tr><td style="font-weight:bold" colspan="2">Totals</td><td style="font-weight:bold" colspan="5">${formatNumberInput(displayValue(totalBudget))}</td></tr>`;
  return tableRows;
}

function getIncomeDonor(dv, deIds) {
  var tableRows = '';
  var count = 0;
  deIds.forEach((ids) => {
    if(dv[ids.name]) {
      tableRows += `<tr><td>${++count}</td><td>${ dv[ids.name] ? dv[ids.name]: ''}</td>
      <td>${dv[ids.income] ? formatNumberInput(displayValue(dv[ids.income])): ''}</td>
      <td>${ dv[ids.comments] ? dv[ids.comments]: ''}</td></tr>`;
    } 
  })
  return tableRows;

}

function getValuesCoreFunding(dv, deIds) {
  var tableRows = '';
  var count = 0;
  deIds.donors.forEach((ids) => {
    if(dv[ids.name]) {
      tableRows += `<tr><td>${++count}</td><td>${ dv[ids.name] ? dv[ids.name]: ''}</td>
      <td>${ dv[ids.amountLocked] ? formatNumberInput(displayValue(dv[ids.amountLocked])) : ''}</td>
      </tr>`;
    } 
  })

  tableRows += `<tr><td colspan="2">Briefly describe the value add of the IPPF unrestricted funding towards achieving your strategic priorities for the funding cycle</td><td colspan="3">${dv[deIds.comments] ? displayValue(dv[deIds.comments]): ''}</td></tr>`

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
  var tableBody = ''
  var restrictedGlobalTotal = 0;
  var unrestrictedGlobalTotal = 0;
  var optionIndex = 0;
  categoryIncome.forEach((categ, index) => {
    tableBody += `<tr><td style="font-weight:bold">${index + 1}. ${categ.name}</td><td style="font-weight:bold">Restricted</td><td style="font-weight:bold">Unrestricted</td></tr>`;
    categ.options.forEach((option) => {
      tableBody += `<tr><td>${option.name}</td>`;
      var restrictedTotal = (dv[deIds[optionIndex]["restricted"]] ? Number(dv[deIds[optionIndex]["restricted"]]) : 0);
      var unrestrictedTotal = (dv[deIds[optionIndex]["unrestricted"]] ? Number(dv[deIds[optionIndex]["unrestricted"]]) : 0);

      tableBody += `<td>${formatNumberInput(displayValue(restrictedTotal))}</td><td>${formatNumberInput(displayValue(unrestrictedTotal))}</td></tr>`
      restrictedGlobalTotal += restrictedTotal;
      unrestrictedGlobalTotal += unrestrictedTotal;
      optionIndex++;
    })
  })

  tableBody += `<tr><td style="font-weight:bold">Totals</td><td style="font-weight:bold">${formatNumberInput(displayValue(restrictedGlobalTotal))}</td><td style="font-weight:bold">${formatNumberInput(displayValue(unrestrictedGlobalTotal))}</td></tr><tr><td style="font-weight:bold">Global Total</td><td colspan="2"  style="font-weight:bold">${formatNumberInput(displayValue(restrictedGlobalTotal + unrestrictedGlobalTotal))}</td></tr><tr><td>Which organisation (government, trust, foundation, IPPF or other donor) was the largest contributor</td><td colspan="2">How much income did they provide?</td></tr>`;
  tableBody += `<tr><td>${ dv[dataElements.organisation] ? dv[dataElements.organisation]: ''}</td><td colspan="2">${ dv[dataElements.incomeProvided] ? formatNumberInput(dv[dataElements.incomeProvided]): ''}</td></tr>`;

  return tableBody;

}

function getCommoditiesSource(dataValues) {
  const unrestrictedValue = (dataValues[dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[dataElements.sourceCommodities['unrestricted']]) : '';
  const internationalValue = (dataValues[dataElements.sourceCommodities['international']]) ?  Number(dataValues[dataElements.sourceCommodities['international']]) : '';
  const localValue = (dataValues[dataElements.sourceCommodities['local']]) ?  Number(dataValues[dataElements.sourceCommodities['local']]) : '';
  const inkindValue = (dataValues[dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[dataElements.sourceCommodities['inkind']]) : '';
  const otherValue = (dataValues[dataElements.sourceCommodities['other']]) ?  Number(dataValues[dataElements.sourceCommodities['other']]) : '';
  const total = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
  const comment = (dataValues[dataElements.sourceCommodities['comment']]) ?  Number(dataValues[dataElements.sourceCommodities['comment']]) : '';

  return `<tr><td>IPPF Unrestricted (Either procurred directly from IPPF or purchased locally using the core grant)</td><td>${unrestrictedValue}</td></tr>
  <tr><td>International donors</td><td>${formatNumberInput(internationalValue)}</td></tr>
  <tr><td>Local Income</td><td>${formatNumberInput(localValue)}</td></tr>
  <tr><td>In-kind donations</td><td>${formatNumberInput(inkindValue)}</td></tr>
  <tr><td>Other</td><td>${formatNumberInput(otherValue)}</td></tr>
  <tr><td>Total</td><td>${formatNumberInput(total)}</td></tr>
  <tr><td>Note</td><td>${comment}</td></tr>`
 
}
function getOrderCommodities(dataSet) {
  var projectRows = '';
  var totalCost = 0;
  const unrestrictedCost = dataSet.values[dataElements.formulaGenerated] ? dataSet.values[dataElements.formulaGenerated]: '';

  dataSet.dataElements.forEach((section,index) => {
    var rows = '';
    var idExist = false;
    section.dataElements.forEach((dataElement) => {
      if(dataSet[dataElement.quantity]) idExist = true;
      var res = displayOrderprojectCommodities(dataElement, dataSet.values, totalCost);
      rows += res.row;
      totalCost += res.totalCost;
    });
      if(idExist) {
        projectRows += `
        <!--- sect 1 --->
        <div class="accordion">
          <div class="accordion-header active" role="button" data-toggle="collapse"
            data-target="#panel-body-${index}">

            <h4 class="d-flex align-items-center">
              <span>${index+1}.</span><span class="input-headings w-100"><input
                  class="w-100" type="text" value="${section.name}"
                  title="${section.name}" readonly></span>
            </h4>

          </div>
          <div class="accordion-body collapse" id="panel-body-${index}" data-parent="#accordion">
            <div class="budget-wrap table-responsive">
              <table class="table table-striped table-md mb-0 " width="100%">
                <thead>
                  <tr>
                    <th data-i18n="intro.product_code">Product Code</th>
                    <th data-i18n="intro.product_name" >Product Name</th>
                    <th data-i18n="intro.manufacturer">Manufacturer</th>
                    <th data-i18n="intro.formulation">Formulation</th>
                    <th data-i18n="intro.unit_measure">Unit of Measure</th>
                    <th data-i18n="intro.rate">Rate</th>
                    <th data-i18n="intro.order_quantity">Order quantity request (per UoM)</th>
                    <th data-i18n="intro.total_price">Total price</th>
                  </tr>
                </thead>
                <tbody>
                ${rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!--- sect {${index+1}} --->`
      }
  })
  const estimatedCost = calculateFreightCost(totalCost);

  projectRows += `<tr><td style="font-weight:bold;text-align:center;background:#eef0ff" colspan="9">Total Price of the Commodities Ordered</td></tr>
    <tr><td colspan="5">Combined Cost of All Commodities Ordered</td><td colspan="4">${formatNumberInput(Math.round(totalCost))}</td></tr>
    <tr><td colspan="5">Estimated Freight Cost</td><td colspan="4">${formatNumberInput(Math.round(estimatedCost))}</td></tr>
    <tr><td colspan="5">Total Estimated Cost of Commodities (including Freight Cost)</td><td colspan="4">${formatNumberInput(Math.round(totalCost+estimatedCost))}</td></tr>
    <tr><td colspan="5">Total Unrestricted Core Grant Amount</td><td colspan="4">${unrestrictedCost ? formatNumberInput(unrestrictedCost) : ''}</td></tr>
    <tr><td colspan="5">Total Estimated Cost of Commodities</td><td colspan="4">${formatNumberInput(Math.round(totalCost+estimatedCost))}</td></tr>
    <tr><td colspan="5">Estimated Core Grant Amount in cash</td><td colspan="4">${formatNumberInput(Math.round(unrestrictedCost-(totalCost+estimatedCost)))}</td></tr>`;
  return projectRows;
}

function displayOrderprojectCommodities(dataElement, dataSetValues) {
    if(!dataSetValues[dataElement.id] || !dataElement.quantity || !dataElement.price) return '';
    var projectRows = ''
    const rate = dataSetValues[dataElement.id] ? dataSetValues[dataElement.id]: '';
    const quantity = dataSetValues[dataElement.quantity] ? dataSetValues[dataElement.quantity]: '';
    const price = dataSetValues[dataElement.price] ? dataSetValues[dataElement.price]: '';
    const description = dataElement.description.split(';');
  
    projectRows += `<tr>
    <td><span id="${dataElement.code}">${dataElement.code}</span></td>
    <td><span id="${dataElement.name}">${dataElement.name}</span></td>
    <td>${(description[0] ? description[0]: '')}</td>
    <td>${(description[1] ? description[1]: '')}</td>
    <td>${(description[2] ? description[2]: '')}</td>
    <td>${rate}</td>
    <td>${quantity}</td>
    <td>${price}</td>
    <td>${(description[3] ? description[3]: '')}</td>
    </tr>`
  return {row: projectRows, totalCost: (rate && quantity ? Math.round(rate * quantity) : 0)};
}

function displayValue(input) {
  if (input === null || input === undefined || input === '') {
    return "";
  }
  
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

  async function fetchDataSet(year) {
    const values = {};
    const dataElementsPrice = await dataSet.getElements(dataSetPrice);
    const dataElementsQuantity = await dataSet.getElements(dataSetQuantity);
    const dataValuesFunds = await dataSet.getValues(dataSetFunds, tei.orgUnit,year);
    const dataValuesPrice = await dataSet.getValues(dataSetPrice, tei.orgUnit,year);
    const dataValuesQuantity = await dataSet.getValues(dataSetQuantity, tei.orgUnit, year);
    dataValuesFunds.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
    dataValuesPrice.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
    dataValuesQuantity.dataValues.forEach(dv => values[dv.dataElement] = dv.value);

    var quantities = {};
    dataElementsQuantity.sections.forEach(quantity => quantity.dataElements.forEach(de => quantities[de.code] = de.id));
    dataElementsPrice.sections.forEach(price => {
      price.dataElements.forEach(de => {
        de['quantity'] = quantities[`${de.code}-quantity`] ? quantities[`${de.code}-quantity`]: ''
        de['price'] = quantities[`${de.code}-price`] ? quantities[`${de.code}-price`]: ''
      })
    })

    return {
      dataElements: dataElementsPrice.sections,
      values
    }
  }
   

function calculateFreightCost(cost) {
  var value = 0;
  if(cost) {
    if(cost > 0 && cost <= 1000) {
      value = freightCostT1 * cost
    }
    else if(cost > 1000 && cost <= 4999) {
      value = freightCostT2 * cost;
    } else {
      value = freightCostT3 * cost;
    }
  }
  return value;
}