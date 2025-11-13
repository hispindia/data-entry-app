const translation_mapping = [
   {
        id: "annual_report",
        en: "2. Entity Update and Validation Module",
        sp: "Presentación y aprobación del informe anual/semestral",
        fr: "Soumission et Approbation du Rapport annuel/semestriel ",
        ar: 'إرسال واعتماد التقرير السنوي/نصف السنوي',
    },
]

$(function () {
    var translations = [{
        lang: 'en',
        name: 'English',
        data: {intro: {}} 
    },
    {
        lang: 'sp',
        name: 'Spanish',
        data: {intro: {}} 
    },
    {
        lang: 'fr',
        name: 'French',
        data: {intro: {}} 
    },
    {
        lang: 'ar',
        name: 'Arabic',
        data: {intro: {}} 
    }];
    translation_mapping.forEach(mapping => {
        translations[0].data.intro[mapping.id] = mapping.en;
        translations[1].data.intro[mapping.id] = mapping.sp;
        translations[2].data.intro[mapping.id] = mapping.fr;
        translations[3].data.intro[mapping.id] = mapping.ar;
    })
    const resources = translations.reduce((acc, { lang, data }) => {
        acc[lang] = { translation: data };
        return acc;
    }, {});

    const languages = translations.reduce((acc, { lang, name }) => {
        acc[lang] = name;
        return acc;
    }, {});


    const languagePresent = window.localStorage.getItem('i18nextLng') || 'en';
    // Initialize i18next
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
            lng: languagePresent,
            resources
        }, function (err, t) {
            if (err) return console.error(err);

            // Initialize jquery-i18next
            jqueryI18next.init(i18next, $);

            // Populate language switcher
            Object.keys(languages).forEach(lang => {
                $('#languageSwitcher').append(
                    new Option(languages[lang], lang, lang === i18next.language)
                );
            });
            $('#languageSwitcher').val(i18next.language);
            if (i18next.language == 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.classList.add('rtl-mode');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.classList.remove('rtl-mode');
            }

            // Localize content
            $('body').localize();

            // Change language event
            $('#languageSwitcher').on('change', function () {
                const selectedLang = $(this).val();
                if (selectedLang == 'ar') {
                    document.documentElement.setAttribute('dir', 'rtl');
                    document.documentElement.classList.add('rtl-mode');
                } else {
                    document.documentElement.setAttribute('dir', 'ltr');
                    document.documentElement.classList.remove('rtl-mode');
                }
                i18next.changeLanguage(selectedLang, function () {
                    $('body').localize();
                });
            });
        });
});