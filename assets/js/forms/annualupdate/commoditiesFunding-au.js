import { dataSet } from "../../api/dataSet.js";
import { getEvents, getProgramStageEvents, getTEI, pushDataElementOther, pushDataElement, createEventOther } from "../../api/func.js";
import { dataElements, dataSetQuantity, program, programStage, tei, dataSetFunds} from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears, unformatNumber } from "../func.js";
import { showToast } from "../../utils.js";

 const maxWords = 200
 var eventPD = '';
 var commoditiesEC='';
 var totalIncome = 0;
 var projectIncome = 0;
 var anticipatedIncome = 0;
 var projectBudgetValues = {};
 var focusAreaValues = {};
 var expenseCategoryValues = {};
 var projectDescriptionTotal = {};
 var narrativePlanValues = {};
 var organisationDetailsValues = {};
 var totalIncomeAndProjDes = {};
 var incomeByDonor = {};
 let userHideReporting = [];
 const programStageEvent = {
  keyDetails: ''
}

  function normalizeHideReporting(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map(v => v.trim()).filter(Boolean);
  }
  return [];
}
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
    let projectDescriptionValues = {};
    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      tei.disabledYear = {};
      for(let year=tei.year.start; year <=tei.year.end; year++) {
        if(year<ev.target.value)  tei.disabledYear[year] = true;
      }
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();

      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
    });

 async function configurePage() {
    const user = await getUserConfig();
    const rawHideReporting = user.hideReporting ?? user.hide_reporting ?? user.permissions?.hideReporting ?? window.localStorage.getItem("hideReporting");
    userHideReporting = normalizeHideReporting(rawHideReporting);
    tei.disabled = Boolean(user.disabled);

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
    } else if(!user.hideReporting.includes('trt') && !user.hideReporting.includes('aoc')) $(`.trt-users`).hide();
      
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }
    
    if(user.hideReporting.includes('ma')) {
      $('.ma-users').show();
    }

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML =years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auOrganisationDetails;
    tei.programStage = programStage.auMembershipDetails;
    

    fetchEvents();    
  }
    async function fetchDataSet(dataSetToTake, year) {
      const values = {};
      const dataValuesQuantity = await dataSet.getValues(dataSetToTake, tei.orgUnit, year);
      dataValuesQuantity.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
      return values;
    }

  async function fetchEvents() {
    tei.year.value = document.getElementById('year-update').value;
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
      
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectBudget || enroll.program == program.auProjectExpenseCategory || enroll.program == program.auProjectDescription 
        || enroll.program == program.auProjectFocusArea || enroll.program == program.auOrganisationDetails || enroll.program == program.auIncomeDetails
      );
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  {id: tei.year.id, value: tei.year.value});
      const dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget, {id: tei.year.id, value: tei.year.value});
      const dataValuesPFA = getEvents(filteredPrograms, program.auProjectFocusArea, {id: tei.year.id, value: tei.year.value});
      const dataValuesNP = getProgramStageEvents(filteredPrograms, programStage.auNarrativePlan, program.auOrganisationDetails, {id: tei.year.id, value: tei.year.value});
      const dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, {id: tei.year.id, value: tei.year.value});
      const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, {id: tei.year.id, value: tei.year.value});
      const dataValuesTC = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value});
      const dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auIncomeByDonor, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value});
      const dataValuesPDWithProgStage = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, {id: tei.year.id, value: tei.year.value});
      focusAreaValues = dataValuesPFA[tei.year.value] || {};
      expenseCategoryValues = dataValuesEC[tei.year.value] || {};
      projectBudgetValues = dataValuesPB[tei.year.value] || {};
      narrativePlanValues = dataValuesNP[tei.year.value] || {};
      organisationDetailsValues = dataValuesOD[tei.year.value] || {};
      totalIncomeAndProjDes = dataValuesTC[tei.year.value] || {};
      incomeByDonor = dataValuesID[tei.year.value] || {};
      projectDescriptionTotal = dataValuesPDWithProgStage[tei.year.value] || {};
      const dataValuesKD = getProgramStageEvents(filteredPrograms, programStage.auKeyDetails, tei.program, {id:tei.year.id,value:tei.year.value});
      const dataValuesMD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, tei.program, {id:tei.year.id,value:tei.year.value});
      if (!dataValuesMD[tei.year.value]) {
        tei.dataValues[tei.year.value] = {}
          let data = [{
            dataElement: tei.year.id,
            value: tei.year.value
          }];
          tei.event = await createEvent(data);
          data.forEach(element => {
            tei.dataValues[tei.year.value][element.dataElement] = element.value;
          })
        } else  {
          tei.event = dataValuesMD[tei.year.value]['event'];
          tei.dataValues[tei.year.value] = {
            ...tei.dataValues[tei.year.value],
            ...dataValuesMD[tei.year.value]
          }
        }
              
      projectDescriptionValues = dataValuesPD[tei.year.value] || {};
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value]['event']) eventPD =dataValuesPD[tei.year.value]['event']
      if (dataValuesPD[tei.year.value]) {
        tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);
      }
      if (!dataValuesKD[tei.year.value]) {
          programStageEvent['keyDetails'] = await createEventOther({
            orgUnit: tei.orgUnit,
            program: program.auOrganisationDetails,
            programStage: programStage.auKeyDetails,
            teiId: tei.id,
            dataElements: [{
              dataElement: tei.year.id,
              value: tei.year.value
            }]
          })
      }
      else {
        programStageEvent['keyDetails'] = dataValuesKD[tei.year.value]["event"];
        tei.dataValues[tei.year.value] = {
          ...tei.dataValues[tei.year.value],
          ...dataValuesKD[tei.year.value]
        }
      }
            
      if(dataValuesEC[tei.year.value] && tei.projects.length) {
        commoditiesEC = calculateExpenseCategory(dataValuesEC[tei.year.value], tei.projects);
      }

      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;
      
      const dataSetValues = await fetchDataSet(dataSetQuantity,tei.year.value);
      tei.dataValues[tei.year.value] = {
        ...tei.dataValues[tei.year.value],
        ...dataSetValues
      };
       dataElements.projectTotalIncome.forEach(pti => {
          if (totalIncomeAndProjDes[pti.restricted]) {
            totalIncome += Number(totalIncomeAndProjDes[pti.restricted]);
          }
          if (totalIncomeAndProjDes[pti.unrestricted]) {
            totalIncome += Number(totalIncomeAndProjDes[pti.unrestricted]);
          }
        })

        const dataSet = await fetchDataSet(dataSetFunds,tei.year.value);
        totalIncome += Number(dataSet[dataElements.fullAllocation]);

        dataElements.projectDescription.forEach(pd => {
          if(projectDescriptionTotal[pd.income]) projectIncome += Number(projectDescriptionTotal[pd.income]);
        })
        anticipatedIncome = incomeByDonor[dataElements.anticipatedIncome];

        populateProgramEvents(tei.dataValues[tei.year.value], dataValuesKD);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues, dataValuesKD) {
    
    $('#push-button').empty();
    document.querySelectorAll('.textValue').forEach((textVal) => {
     if (dataValues[textVal.id]) {
        if(textVal.type=="checkbox") textVal.checked = true;
        else textVal.value = dataValues[textVal.id];   
      } else {
        textVal.value = '';
      }
    })
    if(localStorage.getItem("hideReporting").includes('ma')) {
      const btn = document.createElement("button");
      btn.innerHTML = `<span data-i18n="intro.complete_business_plan">Complete Business Plan </span> ${tei.year.value}`;
      btn.classList.add("btn", "btn-success", "p-2", "m-2");
      btn.addEventListener("click", async(event) => {
      event.preventDefault(); 
      const missingFields = validateProjectDescriptionRequiredFields(projectDescriptionValues);
      const technicalFieldValidation = validateMinimumSelections(
      narrativePlanValues,
        [
          {
            ids: ["Isf6HLsoA8C", "kkZnSBQ4vTm"],
            min: 2,
            message: "Select at least two Main Technical Assistance options."
          },
          {
            ids: ["HtIAWk0c0q2", "ospBjbSOXvH"],
            min: 2,
            message: "Select at least two Organisation Areas of Expertise options."
          }
        ]
      );
      const conditionalFieldsValidation = validateConditionalFields(
      organisationDetailsValues,  
       [
        {
          ifId: "ttOZ4zaMXji",
          ifValue: "true",
          thenId: "dQgZIHO74q5",
          message: "Please provide Input for Question As you have selected <b>Yes</b>: <strong>Does your organisation have a youth group or networks?</strong>"
        },
        {
          ifId: "UaETNe6k15k",
          ifValue: "true",
          thenId: "OvbPe9nCJOd",
          message: "Please provide Input for Question As you have selected <b>Yes</b>: <strong>Does the MA have branches?</strong>"
        }
    ]
  );
      const projectsWithFocusAreaVariance = getProjectsWithVariance(
        projectDescriptionValues,
        projectBudgetValues,
        focusAreaValues,
        dataElements.projectFocusAreaNew
      );
      const projectsWithExpenseAreaVariance = getProjectsWithVariance(
        projectDescriptionValues,
        projectBudgetValues,
        expenseCategoryValues,
        dataElements.projectExpenseCategory
      );
      const incomeVariance = getIncomeVariance(totalIncome, projectIncome);
      const incomeVarianceOfTotalIncomeAndIncomeByDonor = Math.abs(totalIncome - anticipatedIncome);
      const errorBox = document.getElementById("mandatory-error");
      if (errorBox) errorBox.style.display = "none"
      const sections = [];
      if (missingFields.length) {
        sections.push({
          order: 3,
          type: "projectDes",
          title: "2.1 Project Description",
          page: "2.1-project-description-au.html",
          fields: missingFields
        })
      }
      if (technicalFieldValidation.length) {
        sections.push({
          order: 2,
          type: "narrativePlan",
          title: "1.2 Narrative Plan",
          page: "1.2-narrative-plan-au.html",
          fields: technicalFieldValidation
        })
      }
      if (conditionalFieldsValidation.length) {
        sections.push({
          order: 1,
          type: "organisation Details",
          title: "1. Organizational details",
          page: "1.1-organization-details-au.html",
          fields: conditionalFieldsValidation
        })
      }
      if (projectsWithFocusAreaVariance.length) {
        sections.push({
          order: 4,
          type: "focusArea",
          title: "2.3 Breakdown by focus area",
          heading: 'Budget by Focus Area mismatch:',
          breakdownLabel: 'Focus Area',
          sectionTitle: '2.4 Budget by Focus Area',
          page: "2.3-breakdown-by-focus-area-au.html",
          fields: projectsWithFocusAreaVariance
        })
      }
      if (projectsWithExpenseAreaVariance.length) {
        sections.push({
          order: 5,
          type: "expenseArea",
          title: "2.4 Breakdown by expense category",
          heading: 'Budget by Expense Category mismatch:',
          breakdownLabel: 'Expense Category',
          sectionTitle: '2.4 Budget by Expense Category',
          page: "2.4-breakdown-by-expense-category-au.html",
          fields: projectsWithExpenseAreaVariance
        })
      }
      if (incomeVariance) {
        sections.push({
          order: 6,
          type: "incomeVariance",
          heading: "Project and Total Income Mismatch",
          leftLabel: "Total Income",
          rightLabel: "Total Project Income",
          page: [
            "3.1-total-income-au.html",
            "2.1-project-description-au.html"
          ],
          fields: {
            leftValue: totalIncome,
            rightValue: projectIncome,
            variance: totalIncome - projectIncome
          }
        });
      }
      if (incomeVarianceOfTotalIncomeAndIncomeByDonor) {
        sections.push({
          order: 7,
          type: "anticipatedIncome",
          heading: "3.1 & 3.2 Total Income Difference",
          leftLabel: "Total Income",
          rightLabel: "Income by Donor",
          page: [
            "3.1-total-income-au.html",
            "3.2-income-by-donor-au.html"
          ],
          fields: {
            leftValue: totalIncome,
            rightValue: anticipatedIncome,
            variance: totalIncome - anticipatedIncome
          }
        });
      }
      if (sections.length) {
        showMissingFieldsModal(sections);
        return;
      }
      if(eventPD) await pushDataElementOther(dataElements.submitAnnualUpdate,true, program.auProjectDescription, programStage.auProjectDescription, eventPD);
      showToast('Annual Update Submitted Successfully!', "success");
      });
      $('#push-button').append(btn);
    }
    if(localStorage.getItem("hideReporting").includes('ed')) {
      const btn = document.createElement("button");
      btn.innerHTML = `<span data-i18n="intro.complete_business_plan">Complete Business Plan </span> ${tei.year.value}`;
      btn.classList.add("btn", "btn-success", "p-2", "m-2");
      if(tei.disabled) btn.setAttribute("disabled", "true");
      btn.addEventListener("click", async(event) => {
      event.preventDefault(); 
      if(eventPD) await pushDataElementOther(dataElements.submitAnnualUpdate,true, program.auProjectDescription, programStage.auProjectDescription, eventPD);
      showToast('Annual Update Submitted Successfully!', "success");
      });
      $('#push-button').append(btn);
    }
    if(window.localStorage.getItem("hideReporting").includes('aoc')) {
      const btn = document.createElement("button");
      btn.innerHTML = `<span data-i18n="intro.reopen_business_plan">Reopen Business Plan </span> ${tei.year.value}`;
      btn.classList.add("btn", "btn-success", "p-2", "m-2");
      btn.addEventListener("click", async(event) => {
        event.preventDefault(); 
        if(eventPD) await pushDataElementOther(dataElements.submitAnnualUpdate,'', program.auProjectDescription, programStage.auProjectDescription, eventPD);
        showToast('Annual Update Reopened Successfully!',"success");
      });
      $('#push-button').append(btn);
    }

    $("#accordion").empty();

    let projectRows = displaySourceCommodities(dataValues);
    $("#accordion").html(projectRows);
    $('#accordion .textValue').toArray().forEach(el => {
      el.addEventListener("input", async (ev) => {
        var { id, value } = ev.target;
        ev.target.value = formatNumberInput(value);
        await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: id, value: unformatNumber(value)});
        calculateTotals();
      })
    });
    $('#accordion .textlimit').toArray().forEach(el => {
      el.addEventListener("input", async (ev) => {
        var { id, value } = ev.target;
        await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: id, value: value});
        checkWords(ev.target);
      })
    })
    var totalsRow = displayTotals(dataValues);
    $('#totals').empty();
    $('#totals').append(totalsRow);
    document.querySelectorAll('.show-for-sr').forEach((textVal) => {
      const kdValues = dataValuesKD[tei.year.value] || {};
      if (kdValues[textVal.id]) {
        getFileUpload(textVal.id, kdValues[textVal.id]);
      }
    })
    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
    document.querySelectorAll('.textValue').forEach((input)=> {
      input.addEventListener("input", (ev) => {
        const { id,value, type, checked } = ev.target;
        if(type=="checkbox") {
          if(checked) pushDataElementOther(id, true, program.auOrganisationDetails, programStage.auMembershipDetails, tei.event);
          else pushDataElementOther(id, '', program.auOrganisationDetails, programStage.auMembershipDetails, tei.event);
        } else pushDataElementOther(id,value, program.auOrganisationDetails, programStage.auMembershipDetails, tei.event);
      })
    });
    document.querySelectorAll('.show-for-sr').forEach(fileUpload => {
    fileUpload.addEventListener("change", function (ev) {
      const formData = new FormData();
      formData.append('file', ev.target.files[0]);
      fetch('../../fileResources', {
        method: 'POST',
        body: formData
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          linkFileResourceToEvent(ev.target.id, data.response.fileResource);
      })
      .catch(error => {
          console.error('Error uploading file:', error);
      })
    })
  });

      // Localize content
      $('body').localize();
           
  }

  function displayTotals(dataValues) {
    var totalsRow = '';
      const unrestrictedValue = (dataValues[dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[dataElements.sourceCommodities['unrestricted']]) : '';
      const internationalValue = (dataValues[dataElements.sourceCommodities['international']]) ?  Number(dataValues[dataElements.sourceCommodities['international']]) : '';
      const localValue = (dataValues[dataElements.sourceCommodities['local']]) ?  Number(dataValues[dataElements.sourceCommodities['local']]) : '';
      const inkindValue = (dataValues[dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[dataElements.sourceCommodities['inkind']]) : '';
      const otherValue = (dataValues[dataElements.sourceCommodities['other']]) ?  Number(dataValues[dataElements.sourceCommodities['other']]) : '';
      const commodities = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
     
      var variation = 0;
      if(commoditiesEC) variation = commoditiesEC-commodities;
      else if(commodities) variation = -commodities;
      totalsRow += `
            <tr>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
            id="${dataElements.sourceCommodities['commodities']}" 
            class="form-control total currency" 
            value="${formatNumberInput(commodities)}" 
            disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${commoditiesEC ? formatNumberInput(Math.round(commoditiesEC)) : ''}" class="form-control currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${variation >= 0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" value="${formatNumberInput(Math.round(variation))}" id="${dataElements.sourceCommodities['variation']}" class="form-control difference currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    
    return totalsRow;
  }

  function displaySourceCommodities(dataValues) {

    var totalsRow = '';
      const unrestrictedValue = (dataValues[dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[dataElements.sourceCommodities['unrestricted']]) : '';
      const internationalValue = (dataValues[dataElements.sourceCommodities['international']]) ?  Number(dataValues[dataElements.sourceCommodities['international']]) : '';
      const localValue = (dataValues[dataElements.sourceCommodities['local']]) ?  Number(dataValues[dataElements.sourceCommodities['local']]) : '';
      const inkindValue = (dataValues[dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[dataElements.sourceCommodities['inkind']]) : '';
      const otherValue = (dataValues[dataElements.sourceCommodities['other']]) ?  Number(dataValues[dataElements.sourceCommodities['other']]) : '';
      const total = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
     
      totalsRow += `<tr>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['unrestricted']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(unrestrictedValue)}"
                  />
              </div>
          </td>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['international']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(internationalValue)}"
                  />
              </div>
          </td>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['local']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(localValue)}"
                  />
              </div>
          </td>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['inkind']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(inkindValue)}" 
                  />
              </div>
          </td>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['other']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(otherValue)}"
                  />
              </div>
          </td>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  id="${dataElements.sourceCommodities['total']}" 
                  class="total form-control"
                  value="${formatNumberInput(total)}"
                  disabled>
              </div>
          </td>
      </tr>
      <tr>
          <td colspan="12">
              <div class="form-group textbox-wrap">
  
                  <textarea class="form-control textlimit"
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['comment']}" >${(dataValues[dataElements.sourceCommodities['comment']] ? dataValues[dataElements.sourceCommodities['comment']]: '')}</textarea>
                  <div class="char-counter form-text text-muted">
                    <span id="counter">${maxWords- (dataValues[dataElements.sourceCommodities['comment']] ? dataValues[dataElements.sourceCommodities['comment']].trim().split(/\s+/).length: 0)}</span>
                    <span data-i18n="intro.words_remaining">words remaining</span>
                    </div>
  
                  <div class="invalid-feedback"> Error here
                  </div>
              </div>
          </td>
      </tr>`

    return totalsRow;
  }
  configurePage();
});


async function calculateTotals() {
  var totals = 0;
  $(`.textValue`).each((_, de) => {
    totals += unformatNumber($(`#${de.id}`).val());
  })
  $(`.total`).val(formatNumberInput(totals));
  await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement:  dataElements.sourceCommodities['total'], value: totals});
  await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement:  $('.difference')[0].id, value: commoditiesEC-totals});
}

function calculateExpenseCategory(dataValues, projects) {
  var value = 0;
  dataElements.projectExpenseCategory.forEach((de, index) => {
    if(dataValues[de.commodities] && projects[index]) {
      value += Number(dataValues[de.commodities]);
    }
  })
  return value ? value: 0;
}

function hasValidVariance(rawVariance) {
  return rawVariance !== '' &&
    rawVariance !== undefined &&
    rawVariance !== null &&
    !Number.isNaN(Number(rawVariance)) &&
    Number(rawVariance) !== 0;
}

function getProjectVariance(rawValues, projectConfigs, index) {
  return rawValues[projectConfigs[index].variation];
}

function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names= [];
  if(values) {
    projects.forEach((project, index) => {
      const existingMandatoryCondition = Boolean(values[project.name]);
      const hasFocusAreaVariance = hasValidVariance(
        getProjectVariance(focusAreaValues, dataElements.projectFocusAreaNew, index)
      );
      const hasExpenseCategoryVariance = hasValidVariance(
        getProjectVariance(expenseCategoryValues, dataElements.projectExpenseCategory, index)
      );

      if(existingMandatoryCondition || hasFocusAreaVariance || hasExpenseCategoryVariance) {
        names = [...names, ...prevEmptyNames, values[project.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}
  //text area validation
 function checkWords(event) {
      const counter = document.getElementById('counter');
      const { value } = event;
      const words = value.trim().split(/\s+/)

      if (words.length >= maxWords) {
        event.value = words.slice(0, maxWords).join(' ');
        return
      }
      if (value) counter.textContent = `${(maxWords - words.length)} words remaining`;
      else counter.textContent = `${maxWords} words remaining`;
  }
  //for 2.1 project description mandatory check
  function validateProjectDescriptionRequiredFields(values) {
    const missingFields = [];
    const projectConfigs = dataElements.projectDescription || [];

    if(!values) return missingFields;
    projectConfigs?.forEach((proj, index) => {
      const projectNumb = index + 1;
    const hasProjData =
      String(values[proj.name] || "").trim() ||
      String(values[proj.startDate] || "").trim() ||
      String(values[proj.endDate] || "").trim() ||
      String(values[proj.theme] || "").trim() ||
      String(values[proj.funding] || "").trim() ||
      String(values[proj.contract] || "").trim() ||
      String(values[proj.donor] || "").trim() ||
      String(values[proj.income] || "").trim() ||
      String(values[proj.description] || "").trim() 
    const hasFocusAreaVariance = hasValidVariance(
      getProjectVariance(focusAreaValues, dataElements.projectFocusAreaNew, index)
    );
    const hasExpenseCategoryVariance = hasValidVariance(
      getProjectVariance(expenseCategoryValues, dataElements.projectExpenseCategory, index)
    );

    if (!hasProjData && !hasFocusAreaVariance && !hasExpenseCategoryVariance) return;

    const requiredChecks = [
      {key: proj.name, label: `Project ${projectNumb} - Project Name`},
      {key: proj.startDate, label: `Project ${projectNumb} - Project Start Date`},
      {key: proj.endDate, label: `Project ${projectNumb} - Project End Date`},
      {key: proj.theme, label: `Project ${projectNumb} - Project Theme`},
      {key: proj.funding, label: `Project ${projectNumb} - Project Funding`},
      {key: proj.contract, label: `Project ${projectNumb} - Project Contract`},
      {key: proj.donor, label: `Project ${projectNumb} - Project Donor`},
      {key: proj.income, label: `Project ${projectNumb} - Project Income`},
      {key: proj.description, label: `Project ${projectNumb} - Project Description`},
    ];
      const groupFields = {};
      requiredChecks.forEach(({key, label}) => {
        if (!String(values[key] || "").trim()) {          
          missingFields.push(label);
        }
      });

      const themeValue = String(values[proj.theme] || "").trim();
      if (themeValue === "Other (please fill in)" && !String(values[proj.themeOther] || "").trim()) {
        missingFields.push(`Project ${projectNumb} - Other Project Theme`);
      }

      const donorValue = String(values[proj.donor] || "").trim();
      if (donorValue === "Other (please write below)" && !String(values[proj.donorOther] || "").trim()) {
        missingFields.push(`Project ${projectNumb} - Other Project Donor`);
      }

    });
    return [...new Set(missingFields)];
  }

  function validateMinimumSelections(values, rules) {
    const errors = [];
    rules.forEach(rule => {
      const count = rule.ids.filter(id => values[id]).length;
      if (count < rule.min) {
        errors.push(rule.message);
      }
    });
   return errors;
  }

  function validateConditionalFields(values, rules) {
    const errors = [];
    rules.forEach(rule => {
      if (values[rule.ifId] === rule.ifValue && !values[rule.thenId]) {
        errors.push(rule.message);
      }
    });
    return errors;
  }
  
  //for 2.2 page - budet diff
  function getProjectsWithVariance(values, budgetValues, varianceValues, varianceConfigs) {
    return (dataElements.projectDescription || []).reduce((projects, project, index) => {
      const rawVariance = getProjectVariance(varianceValues, varianceConfigs, index);

      if (hasValidVariance(rawVariance)) {
        const totalExpenseBudget = Number(budgetValues[dataElements.projectBudget[index].budget]) || 0;
        const breakdownBudget = totalExpenseBudget - Number(rawVariance);
        projects.push({
          number: index + 1,
          name: values[project.name] || `Project ${index + 1}`,
          totalExpenseBudget,
          breakdownBudget,
          variance: Number(rawVariance),
        });
      }

      return projects;
    }, []);
  }
  //for 3.1 and 2.2 proj - diff
  function getIncomeVariance(totalIncome, projectIncome) {
    const variance = Number(totalIncome) - Number(projectIncome);
    if (variance === 0) return null;
    return { totalIncome, projectIncome, variance};
  }

  //for 2.2 page and 2.3 page render variance - budget diff
  function renderVarianceSection(section) {
    const { heading, page, sectionTitle, breakdownLabel, fields} = section;
    if (!fields.length) return "";
    return `
        <h6 style="color:#C53030;margin:20px 0 12px;font-weight:700;">
          ${heading}
        </h6>
        ${fields.map((project, index) => `
              <div class="card mb-2" style="border:1px solid #FED7D7;">
                 <div class="card-header" data-toggle="collapse"
                    data-target="#variance-${section.order}-${index}"
                    style="cursor:pointer; background:#FFF5F5; font-weight:600;
                      color:#C53030;">
                    Budget mismatch detected in ${project.name}
                  </div>
                  <div id="variance-${section.order}-${index}" class="collapse">
                    <div class="card-body">
                    <p>
                      The Total Expense Budget entered in
                      <strong>2.2 Project Details</strong>
                      ($${formatNumberInput(project.totalExpenseBudget)})
                      does not match the Total Expense Budget by
                      ${breakdownLabel}
                      in <strong>${sectionTitle}</strong>
                      ($${formatNumberInput(project.breakdownBudget)}).
                    </p>
                    <p>
                      <strong>Difference:
                      $${formatNumberInput(Math.abs(project.variance))}</strong>
                    </p>
                    <a href="${page}">Go to ${sectionTitle}</a>
                  </div>
                  </div>

            </div>
        `).join("")}
    `;
}
// for 3.1 and 2.2 proj descrp variance display
  function renderIncomeVariance(section) {

      const {heading, leftLabel, rightLabel, page, fields} = section;
      const {leftValue, rightValue, variance} = fields;
      return `
          <h6 style="color:#C53030;margin:20px 0 12px;font-weight:700;">
            ${heading}  
          </h6>
            <div class="card mb-2" style="border:1px solid #FED7D7;">
                   <div class="card-header" data-toggle="collapse"
                      data-target="#variance-${section.order}"
                      style="cursor:pointer; background:#FFF5F5; font-weight:600;
                      color:#C53030;" style="background:#FFF5F5;font-weight:600;color:#C53030;">
                      Income totals do not match
                    </div>
                <div class="collapse" id="variance-${section.order}">
                  <div class="card-body">
                      <p>
                        ${leftLabel}:
                        <strong>$${formatNumberInput(leftValue)}</strong>
                        <a href="${page[0]}">Go to Page</a>
                      </p>
                      <p>
                        ${rightLabel}:
                        <strong>$${formatNumberInput(rightValue)}</strong>
                        <a href="${page[1]}">Go to Page</a>
                      </p>
                      <p>
                        Difference:
                        <strong>$${formatNumberInput(Math.abs(variance))}</strong>
                      </p>
                    </div>
                  </div>
                </div>
      `;
  }
  //for 2.2 page and 2.3 page render variance - budget diff
  function showMissingFieldsModal(
    sections,
    projectsWithFocusAreaVariance = [],
    projectsWithExpenseAreaVariance = []
) {

    $('#missingFieldsModal').remove();
    const totalErrors = sections.length + projectsWithFocusAreaVariance.length + projectsWithExpenseAreaVariance.length;
    sections.sort((a, b) => a.order - b.order);
    const modalHtml = `
      <div class="modal fade" id="missingFieldsModal" tabindex="-1" role="dialog" aria-labelledby="missingFieldsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content" style="border-radius:10px;border:none;overflow:hidden;">

            <div class="modal-header" style="background:#FFF5F5;border-bottom:1px solid #FED7D7;">             
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;
                  width:26px;
                  height:26px;
                  background:#E53E3E;
                  color:#fff;
                  border-radius:50%;
                  font-size:15px;
                  font-weight:bold;
                  flex-shrink:0;
                ">!</span>
                <h5 class="modal-title" id="missingFieldsModalLabel" style="color:#C53030;margin:0;">
                  The Annual Business Plan contains <strong>${totalErrors}</strong> validation issue(s).
                  Please complete the required fields before submitting.
                </h5>
              </div>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>

            </div>

            <div class="modal-body" style="padding:20px 24px;">
              <div style="max-height:55vh;overflow-y:auto;">
              ${sections.map(section => {
                  switch (section.type) {

                    case "focusArea":
                    case "expenseArea":
                    return renderVarianceSection(section);

                    case "incomeVariance":
                    case "anticipatedIncome":
                    return renderIncomeVariance(section);

                    default:
                    return renderMandatorySection(section);
                  }
                }).join("")}

              </div>
            </div>

            <div class="modal-footer" style="border-top:1px solid #eee;">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    $('body').append(modalHtml);
    $('#missingFieldsModal').modal('show');

    $('#missingFieldsModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}
  function renderMandatorySection(sections) {
      const {title, page, fields} = sections;
      if (!fields.length) return "";
      const groupFields = {};

      fields.forEach(field => {
          const parts = field.split(" - ");
          if (parts.length >= 2) {
              const group = parts[0];
              const fieldName = parts.slice(1).join(" - ");
              if (!groupFields[group]) {
                  groupFields[group] = [];
              }
              groupFields[group].push(fieldName);
          }
          else {
              if (!groupFields[title]) {
                groupFields[title] = [];
              }
              groupFields[title].push(field);
          }
      });

      return `
          <div class="mb-4">
              <p style="color:#555;margin-bottom:16px;">
                  Please complete the following required fields in
                  <strong>${title}
                      <a href="${page}">Go to Page</a>
                  </strong>
                  before submitting:
              </p>
              ${Object.entries(groupFields).map(([group, items], index) => `
                  <div class="card mb-2" style="border:1px solid #FED7D7;">
                        <div class="card-header"
                          data-toggle="collapse"
                          data-target="#mandatory-${title.replace(/\W/g,'')}-${index}"
                          style="cursor:pointer; background:#FFF5F5;font-weight:600; color:#C53030;
                            display:flex; justify-content:space-between;align-items:center;">
                            ${group}
                          <span class="badge badge-danger">
                            Missing fields: ${items.length}
                          </span>
                       </div>
                        <div
                          id="mandatory-${title.replace(/\W/g,'')}-${index}"
                          class="collapse">
                          <ul class="list-group list-group-flush">
                              ${items.map(item => `
                                  <li class="list-group-item"
                                    style="border:none;padding:8px 18px;">
                                    • ${item}
                                  </li>
                              `).join("")}
                          </ul>
                        </div>
                  </div>
              `).join("")}
          </div>
      `;
  }

async function getFileUpload(elementId,deValue) {
  try{
    const fileData = await fetchFileResource(deValue);
   
    if (fileData) {
        fileData['url'] = `../../events/files?eventUid=${programStageEvent['keyDetails']}&dataElementUid=${elementId}`;
        updateFileLabel(elementId, fileData.displayName, fileData.url);
    }
  }
  catch(error) {
    console.log('file upload error')
  }
}

function updateFileLabel(elementId, fileName, fileUrl) {
  const downloadLink = document.getElementById(`${elementId}-download`);
  downloadLink.href = fileUrl;
  downloadLink.textContent = fileName;
  downloadLink.setAttribute('download', fileName); 
  document.getElementById(`${elementId}-download`).style.display = 'block';
}

async function fetchFileResource(resourceId) {
  const apiUrl = `../../fileResources/${resourceId}`;
  try {
      const response = await fetch(apiUrl, {
          method: 'GET',
      });

      if (!response.ok) {
          alert("error")
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }

}

async function linkFileResourceToEvent(id, fileResource) {
  await pushDataElementOther(id,fileResource.id,program.auOrganisationDetails, programStage.auKeyDetails, programStageEvent['keyDetails']);
  fileResource['url'] = `../../events/files?eventUid=${programStageEvent['keyDetails']}&dataElementUid=${id}`;
  updateFileLabel(id, fileResource.displayName, fileResource.url);
}
    
  function submitProjects() {
      showToast("Data Saved Successfully!", "success")
  }
