/**
 * Hindi (हिन्दी) locale strings for Linear Calendar.
 */

const hi = {
  appName: 'रैखिक कैलेंडर',

  /** Browser tab title. */
  pageTitle: year => `${year} — रैखिक कैलेंडर`,

  header: {
    switchToLight: 'हल्के मोड में स्विच करें',
    switchToDark: 'गहरे मोड में स्विच करें',
    lightMode: 'हल्का मोड',
    darkMode: 'गहरा मोड',
    help: 'सहायता',
    install: 'इंस्टॉल करें',
    installTitle: 'ऐप इंस्टॉल करें',
    export: 'निर्यात करें',
    exportTitle: 'घटनाओं को .ics के रूप में निर्यात करें',
    import: 'आयात करें',
    importTitle: '.ics फ़ाइल से घटनाएं आयात करें',
    clear: 'साफ़ करें',
    clearTitle: 'सभी घटनाएं और टैग साफ़ करें',
    print: 'प्रिंट करें',
    printTitle: 'कैलेंडर प्रिंट करें',
  },

  footer: {
    /** @param {number} year */
    copyright: year => `© ${year} Arun K Viswanathan`,
    builtWith: 'निर्मित dengan',
  },

  toast: {
    updateAvailable: 'एक नया संस्करण उपलब्ध है।',
    reload: 'पुनः लोड करें',
  },

  yearSwitcher: {
    prevYear: 'पिछला वर्ष',
    nextYear: 'अगला वर्ष',
    enterYear: 'वर्ष दर्ज करें',
    cancelYear: 'कस्टम वर्ष रद्द करें',
    cancelTitle: 'रद्द करें',
    selectYear: 'वर्ष चुनें',
    customOption: 'वर्ष दर्ज करें…',
  },

  yearPicker: {
    subtitle: 'शुरू करने के लिए एक वर्ष चुनें',
    prevYear: 'पिछला वर्ष',
    yearLabel: 'वर्ष',
    nextYear: 'अगला वर्ष',
    viewCalendar: 'कैलेंडर देखें →',
  },

  eventModal: {
    newEvent: 'नई घटना',
    editEvent: 'घटना संपादित करें',
    close: 'बंद करें',
    titleLabel: 'शीर्षक',
    titlePlaceholder: 'घटना का शीर्षक',
    startLabel: 'प्रारंभ',
    endLabel: 'समाप्ति',
    tagLabel: 'टैग',
    tagNone: 'कोई नहीं',
    newTagTrigger: '+ नया टैग',
    tagNamePlaceholder: 'टैग का नाम',
    createTag: 'बनाएं',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    deleteEvent: 'हटाएं',
  },

  tagFilterBar: {
    label: 'टैग:',
    tagNamePlaceholder: 'टैग का नाम',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    /** @param {string} name */
    editTag: name => `टैग ${name} संपादित करें`,
    /** @param {string} name */
    deleteTag: name => `टैग ${name} हटाएं`,
  },

  clearDialog: {
    ariaLabel: 'कैलेंडर साफ़ करने की पुष्टि',
    title: 'कैलेंडर साफ़ करें?',
    bodyPrefix: 'यह स्थायी रूप से हटा देगा',
    /** @param {number} n */
    eventCount: n => `${n} घटना${n !== 1 ? 'एं' : ''}`,
    bodyAnd: 'और',
    /** @param {number} n */
    tagCount: n => `${n} टैग`,
    bodySuffix: 'इसे पूर्ववत नहीं किया जा सकता।',
    exportHint: '💡 हम सफ़ाई से पहले अपने डेटा को निर्यात करने की सलाह देते हैं।',
    exportFirst: 'पहले निर्यात करें',
    cancel: 'रद्द करें',
    confirm: 'सब कुछ साफ़ करें',
  },

  deleteTagDialog: {
    ariaLabel: 'टैग हटाने की पुष्टि',
    /** @param {string|undefined} name */
    title: name => (name ? `टैग "${name}" हटाएं?` : 'टैग हटाएं?'),
    /** @param {number} n */
    eventCount: n => `${n} घटना${n !== 1 ? 'एं' : ''}`,
    usesTag: 'इस टैग का उपयोग करती हैं। टैग को हटा दिया जाएगा',
    singularRef: 'उस घटना',
    pluralRef: 'उन घटनाओं',
    bodySuffix: 'से और हटा दिया जाएगा।',
    cancel: 'रद्द करें',
    confirm: 'टैग हटाएं',
  },

  importError: {
    invalidType: 'अमान्य फ़ाइल प्रकार — कृपया एक .ics फ़ाइल चुनें।',
    noEvents: 'फ़ाइल में कोई मान्य घटना नहीं मिली।',
    tooLarge: 'फ़ाइल बहुत बड़ी है (अधिकतम 5 MB)।',
    parseFailed: '.ics फ़ाइल को पार्स करने में विफल।',
  },

  helpModal: {
    ariaLabel: 'सहायता',
    title: 'रैखिक कैलेंडर में आपका स्वागत है',
    close: 'बंद करें',
    intro: 'एक वर्ष-एक-नज़र में कैलेंडर जहां हर महीना एक क्षैतिज पंक्ति है।',
    gotIt: 'समझ गया',

    gettingStarted: {
      heading: 'शुरुआत करना',
      addEvent: 'घटना जोड़ें',
      addEventText: '— कैलेंडर पर किसी भी दिन की सेल पर क्लिक करें।',
      editEvent: 'घटना संपादित या हटाएं',
      editEventText: '— रंगीन घटना पट्टी पर क्लिक करें।',
      changeYear: 'वर्ष बदलें',
      changeYearText: '— हेडर में वर्ष स्विचर का उपयोग करें, या बुकमार्क करें',
      changeYearCode: '?year=2025',
      changeYearSuffix: '।',
    },

    tags: {
      heading: 'टैग',
      assignPrefix: 'किसी भी घटना को आसानी से समूहबद्ध करने के लिए एक',
      assignTag: 'टैग',
      assignSuffix: '(रंग के साथ) असाइन करें।',
      createInline: 'घटना जोड़ते या संपादित करते समय इनलाइन टैग बनाएं।',
      toggleVisibility: 'हेडर के नीचे फ़िल्टर बार से टैग दृश्यता टॉगल करें।',
    },

    importExport: {
      heading: 'आयात और निर्यात',
      exportLabel: 'निर्यात करें',
      exportText: '— सभी घटनाओं को मानक',
      exportCode: '.ics',
      exportSuffix: 'फ़ाइल के रूप में डाउनलोड करता है।',
      importLabel: 'आयात करें',
      importText: '— किसी भी',
      importCode: '.ics',
      importSuffix: 'फ़ाइल से घटनाएं लोड करता है (वर्तमान डेटा बदल देता है)।',
    },

    shortcuts: {
      heading: 'कीबोर्ड शॉर्टकट',
      helpKbd: '?',
      helpText: '— सहायता खोलें।',
      newEventKbd: 'N',
      newEventText: '— नई घटना बनाएं।',
      exportKbd: 'X',
      exportText: '— घटनाओं को',
      exportCode: '.ics',
      exportSuffix: 'के रूप में निर्यात करें।',
      importKbd: 'I',
      importText: '—',
      importCode: '.ics',
      importSuffix: 'फ़ाइल से आयात करें।',
      escKbd: 'Esc',
      escText: '— वर्तमान संवाद बंद करें।',
    },

    other: {
      heading: 'अन्य',
      togglePrefix: 'चंद्रमा/सूर्य आइकन के साथ',
      toggleLabel: 'गहरे / हल्के मोड',
      toggleSuffix: 'टॉगल करें।',
      printLabel: 'प्रिंट करें',
      printText: 'एक साफ़, लैंडस्केप-अनुकूलित दृश्य देता है।',
      localStorage:
        'सभी डेटा आपके ब्राउज़र में स्थानीय रूप से संग्रहीत है — सर्वर पर कुछ नहीं भेजा जाता है।',
    },
  },

  calendar: {
    months: ['जन', 'फर', 'मार', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'],
    dayAbbrs: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
    dateRangeSeparator: '–',
  },
}

export default hi
