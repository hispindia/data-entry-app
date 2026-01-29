
export function formatNumberInput(valueOrInput) {
    let value;

    if (typeof valueOrInput === "object" && valueOrInput !== null) {
        value = valueOrInput.value;
    } else {
        value = valueOrInput;
    }

    if (value == null || value === "") return ""; // Safely handle null, undefined, empty

    // Convert scientific notation to decimal string
    if (/^-?\d+(\.\d+)?e[+-]?\d+$/i.test(String(value))) {
        value = Number(value).toFixed(20).replace(/\.?0+$/, "");
    }

    value = value.toString().replace(/[^0-9.-]/g, ""); // Remove non-numeric except '.'
    let parts = value.split(".");

    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Prevent multiple decimals (Keep only the first decimal part)
    let formattedValue = parts.length > 1 ? parts[0] + "." + parts[1].substring(0, 2) : parts[0];

    // Update input field if an element was passed
    if (typeof valueOrInput === "object") {
        valueOrInput.value = formattedValue;
    }

    return formattedValue; // Return formatted number if called directly
}

// Function to remove commas
export function unformatNumber(value) {
    if(value==null) return 0;
    return Number(value.replace(/[^0-9.-]/g, ""));
}

export function getYears(start ="2023", end) {
    var years = [];
    for(let year = start; year <= end; year++) years.push(year);
    return years;
}


export function disableAll() {
      $('.textValue').prop('disabled', true);

      // Disable all select elements
      $('.select-option').prop('disabled', true);

      // Disable all checkbox elements
      $('input[type="checkbox"]').prop('disabled', true);

      // Disable all radio button elements
      $('input[type="radio"]').prop('disabled', true);

      // Disable all file input elements
      $('input[type="file"]').prop('disabled', true);
      //Disable all button
    //   $('button').prop('disabled', true);
}

export function enableAll() {
    $('.textValue').prop('disabled', false);

    // Enable all select elements
    $('.select-option').prop('disabled', false);

    // Enable all checkbox elements
    $('input[type="checkbox"]').prop('disabled', false);

    // Enable all radio button elements
    $('input[type="radio"]').prop('disabled', false);

    // Enable all file input elements
    $('input[type="file"]').prop('disabled', false);

    // Enable all button elements
    // $('button').prop('disabled', false);
}

export function getNextCode(codes) {
  let max = 0;

  for (const code of codes) {
    const match = code.match(/(\d+)$/);
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }

  const next = max + 1;
  return String(next).padStart(3, '0');
}

export function toast({status, message}) {
    iziToast.settings({
      timeout: 1500, 
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
      position: 'center', 
    });

    switch(status) {
        case "SUCCESS":
            iziToast.success({message});
        break;
        case "INFO":
            iziToast.info({message});
        break;
        case "WARNING":
            iziToast.warning({message});
        break;
        case "ERROR":
            iziToast.error({message});
        break;
    }
}

export function isGmailOrYahoo(email) {
    const regex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/i;
    return regex.test(email);
}
