/**
 * French (Français) locale strings for Linear Calendar.
 */

const fr = {
  appName: 'Calendrier Linéaire',

  /** Browser tab title. */
  pageTitle: year => `${year} — Calendrier Linéaire`,

  header: {
    switchToLight: 'Passer en mode clair',
    switchToDark: 'Passer en mode sombre',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    help: 'Aide',
    install: 'Installer',
    installTitle: "Installer l'application",
    export: 'Exporter',
    exportTitle: 'Exporter les événements en .ics',
    import: 'Importer',
    importTitle: 'Importer des événements depuis .ics',
    clear: 'Effacer',
    clearTitle: 'Effacer tous les événements et étiquettes',
    print: 'Imprimer',
    printTitle: 'Imprimer le calendrier',
  },

  footer: {
    /** @param {number} year */
    copyright: year => `© ${year} Arun K Viswanathan`,
    builtWith: 'Conçu avec',
  },

  toast: {
    updateAvailable: 'Une nouvelle version est disponible.',
    reload: 'Recharger',
  },

  yearSwitcher: {
    prevYear: 'Année précédente',
    nextYear: 'Année suivante',
    enterYear: "Saisir l'année",
    cancelYear: "Annuler l'année personnalisée",
    cancelTitle: 'Annuler',
    selectYear: 'Sélectionner une année',
    customOption: 'Saisir une année…',
  },

  yearPicker: {
    subtitle: 'Choisissez une année pour commencer',
    prevYear: 'Année précédente',
    yearLabel: 'Année',
    nextYear: 'Année suivante',
    viewCalendar: 'Voir le Calendrier →',
  },

  eventModal: {
    newEvent: 'Nouvel événement',
    editEvent: "Modifier l'événement",
    close: 'Fermer',
    titleLabel: 'Titre',
    titlePlaceholder: "Titre de l'événement",
    startLabel: 'Début',
    endLabel: 'Fin',
    tagLabel: 'Étiquette',
    tagNone: 'Aucune',
    newTagTrigger: '+ Nouvelle étiquette',
    tagNamePlaceholder: "Nom de l'étiquette",
    createTag: 'Créer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    deleteEvent: 'Supprimer',
  },

  tagFilterBar: {
    label: 'Étiquettes :',
    tagNamePlaceholder: "Nom de l'étiquette",
    save: 'Enregistrer',
    cancel: 'Annuler',
    /** @param {string} name */
    editTag: name => `Modifier l'étiquette ${name}`,
    /** @param {string} name */
    deleteTag: name => `Supprimer l'étiquette ${name}`,
  },

  clearDialog: {
    ariaLabel: 'Confirmation de suppression du calendrier',
    title: 'Effacer le calendrier ?',
    bodyPrefix: 'Cela supprimera définitivement',
    /** @param {number} n */
    eventCount: n => `${n} événement${n !== 1 ? 's' : ''}`,
    bodyAnd: 'et',
    /** @param {number} n */
    tagCount: n => `${n} étiquette${n !== 1 ? 's' : ''}`,
    bodySuffix: 'Cette action est irréversible.',
    exportHint: "💡 Nous recommandons d'exporter vos données avant d'effacer.",
    exportFirst: "Exporter d'abord",
    cancel: 'Annuler',
    confirm: 'Tout effacer',
  },

  deleteTagDialog: {
    ariaLabel: "Confirmation de suppression d'étiquette",
    /** @param {string|undefined} name */
    title: name => (name ? `Supprimer l'étiquette « ${name} » ?` : "Supprimer l'étiquette ?"),
    /** @param {number} n */
    eventCount: n => `${n} événement${n !== 1 ? 's' : ''}`,
    usesTag: 'utilise cette étiquette. Elle sera supprimée de',
    singularRef: 'cet événement',
    pluralRef: 'ces événements',
    bodySuffix: 'et supprimée.',
    cancel: 'Annuler',
    confirm: "Supprimer l'étiquette",
  },

  importError: {
    invalidType: 'Type de fichier non valide — veuillez sélectionner un fichier .ics.',
    noEvents: 'Aucun événement valide trouvé dans le fichier.',
    tooLarge: 'Fichier trop volumineux (max 5 Mo).',
    parseFailed: "Échec de l'analyse du fichier .ics.",
  },

  helpModal: {
    ariaLabel: 'Aide',
    title: 'Bienvenue dans le Calendrier Linéaire',
    close: 'Fermer',
    intro: 'Un calendrier annuel où chaque mois est une ligne horizontale.',
    gotIt: "J'ai compris",

    gettingStarted: {
      heading: 'Pour commencer',
      addEvent: 'Ajouter un événement',
      addEventText: "— cliquez sur n'importe quelle cellule de date du calendrier.",
      editEvent: 'Modifier ou supprimer un événement',
      editEventText: "— cliquez sur la barre colorée de l'événement.",
      changeYear: "Changer d'année",
      changeYearText: "— utilisez le sélecteur dans l'en-tête, ou ajoutez",
      changeYearCode: '?year=2025',
      changeYearSuffix: ' aux favoris.',
    },

    tags: {
      heading: 'Étiquettes',
      assignPrefix: 'Attribuez une',
      assignTag: 'étiquette',
      assignSuffix: '(avec une couleur) à tout événement pour un regroupement facile.',
      createInline: "Créez des étiquettes en ligne lors de l'ajout ou de la modification.",
      toggleVisibility: 'Activez la visibilité des étiquettes depuis la barre de filtres.',
    },

    importExport: {
      heading: 'Import et Export',
      exportLabel: 'Exporter',
      exportText: '— télécharge tous les événements en fichier',
      exportCode: '.ics',
      exportSuffix: 'standard.',
      importLabel: 'Importer',
      importText: '— charge des événements depuis un fichier',
      importCode: '.ics',
      importSuffix: '(remplace les données actuelles).',
    },

    shortcuts: {
      heading: 'Raccourcis clavier',
      helpKbd: '?',
      helpText: "— ouvrir l'aide.",
      newEventKbd: 'N',
      newEventText: '— créer un nouvel événement.',
      exportKbd: 'X',
      exportText: '— exporter les événements en',
      exportCode: '.ics',
      exportSuffix: '.',
      importKbd: 'I',
      importText: '— importer depuis un fichier',
      importCode: '.ics',
      importSuffix: '.',
      escKbd: 'Esc',
      escText: '— fermer la boîte de dialogue.',
    },

    other: {
      heading: 'Autre',
      togglePrefix: 'Basculer entre le',
      toggleLabel: 'mode sombre / clair',
      toggleSuffix: "avec l'icône lune/soleil.",
      printLabel: 'Imprimer',
      printText: 'affiche une vue optimisée pour le paysage.',
      localStorage: 'Toutes les données sont stockées localement dans votre navigateur.',
    },
  },

  calendar: {
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    dayAbbrs: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    dateRangeSeparator: '–',
  },
}

export default fr
