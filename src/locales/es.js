/**
 * Spanish (Español) locale strings for Linear Calendar.
 */

const es = {
  appName: 'Calendario Lineal',

  /** Browser tab title. */
  pageTitle: year => `${year} — Calendario Lineal`,

  header: {
    switchToLight: 'Cambiar a modo claro',
    switchToDark: 'Cambiar a modo oscuro',
    lightMode: 'Modo claro',
    darkMode: 'Modo oscuro',
    help: 'Ayuda',
    install: 'Instalar',
    installTitle: 'Instalar aplicación',
    export: 'Exportar',
    exportTitle: 'Exportar eventos como .ics',
    import: 'Importar',
    importTitle: 'Importar eventos desde .ics',
    clear: 'Limpiar',
    clearTitle: 'Limpiar todos los eventos y etiquetas',
    print: 'Imprimir',
    printTitle: 'Imprimir calendario',
  },

  footer: {
    /** @param {number} year */
    copyright: year => `© ${year} Arun K Viswanathan`,
    builtWith: 'Hecho con',
  },

  toast: {
    updateAvailable: 'Hay una nueva versión disponible.',
    reload: 'Recargar',
  },

  yearSwitcher: {
    prevYear: 'Año anterior',
    nextYear: 'Año siguiente',
    enterYear: 'Introducir año',
    cancelYear: 'Cancelar año personalizado',
    cancelTitle: 'Cancelar',
    selectYear: 'Seleccionar año',
    customOption: 'Introducir año…',
  },

  yearPicker: {
    subtitle: 'Elige un año para comenzar',
    prevYear: 'Año anterior',
    yearLabel: 'Año',
    nextYear: 'Año siguiente',
    viewCalendar: 'Ver Calendario →',
  },

  eventModal: {
    newEvent: 'Nuevo evento',
    editEvent: 'Editar evento',
    close: 'Cerrar',
    titleLabel: 'Título',
    titlePlaceholder: 'Título del evento',
    startLabel: 'Inicio',
    endLabel: 'Fin',
    tagLabel: 'Etiqueta',
    tagNone: 'Ninguna',
    newTagTrigger: '+ Nueva etiqueta',
    tagNamePlaceholder: 'Nombre de etiqueta',
    createTag: 'Crear',
    cancel: 'Cancelar',
    save: 'Guardar',
    deleteEvent: 'Eliminar',
  },

  tagFilterBar: {
    label: 'Etiquetas:',
    tagNamePlaceholder: 'Nombre de etiqueta',
    save: 'Guardar',
    cancel: 'Cancelar',
    /** @param {string} name */
    editTag: name => `Editar etiqueta ${name}`,
    /** @param {string} name */
    deleteTag: name => `Eliminar etiqueta ${name}`,
  },

  clearDialog: {
    ariaLabel: 'Confirmación para limpiar calendario',
    title: '¿Limpiar calendario?',
    bodyPrefix: 'Esto eliminará permanentemente',
    /** @param {number} n */
    eventCount: n => `${n} evento${n !== 1 ? 's' : ''}`,
    bodyAnd: 'y',
    /** @param {number} n */
    tagCount: n => `${n} etiqueta${n !== 1 ? 's' : ''}`,
    bodySuffix: 'Esta acción no se puede deshacer.',
    exportHint: '💡 Recomendamos exportar sus datos antes de limpiar.',
    exportFirst: 'Exportar primero',
    cancel: 'Cancelar',
    confirm: 'Limpiar todo',
  },

  deleteTagDialog: {
    ariaLabel: 'Confirmación para eliminar etiqueta',
    /** @param {string|undefined} name */
    title: name => (name ? `¿Eliminar etiqueta «${name}»?` : '¿Eliminar etiqueta?'),
    /** @param {number} n */
    eventCount: n => `${n} evento${n !== 1 ? 's' : ''}`,
    usesTag: 'usan esta etiqueta. La etiqueta se eliminará de',
    singularRef: 'ese evento',
    pluralRef: 'esos eventos',
    bodySuffix: 'y se borrará.',
    cancel: 'Cancelar',
    confirm: 'Eliminar etiqueta',
  },

  importError: {
    invalidType: 'Tipo de archivo no válido — seleccione un archivo .ics.',
    noEvents: 'No se encontraron eventos válidos en el archivo.',
    tooLarge: 'Archivo demasiado grande (máx. 5 MB).',
    parseFailed: 'No se pudo analizar el archivo .ics.',
  },

  helpModal: {
    ariaLabel: 'Ayuda',
    title: 'Bienvenido al Calendario Lineal',
    close: 'Cerrar',
    intro: 'Un calendario de vista anual donde cada mes es una fila horizontal.',
    gotIt: 'Entendido',

    gettingStarted: {
      heading: 'Primeros pasos',
      addEvent: 'Añadir un evento',
      addEventText: '— haga clic en cualquier celda de fecha del calendario.',
      editEvent: 'Editar o eliminar un evento',
      editEventText: '— haga clic en la barra de evento coloreada.',
      changeYear: 'Cambiar año',
      changeYearText: '— use el selector de año en la cabecera, o guarde',
      changeYearCode: '?year=2025',
      changeYearSuffix: '.',
    },

    tags: {
      heading: 'Etiquetas',
      assignPrefix: 'Asigne una',
      assignTag: 'etiqueta',
      assignSuffix: '(con color) a cualquier evento para agruparlos fácilmente.',
      createInline: 'Cree etiquetas directamente mientras añade o edita un evento.',
      toggleVisibility:
        'Active la visibilidad de etiquetas desde la barra de filtros debajo de la cabecera.',
    },

    importExport: {
      heading: 'Importar y Exportar',
      exportLabel: 'Exportar',
      exportText: '— descarga todos los eventos como un archivo',
      exportCode: '.ics',
      exportSuffix: 'estándar.',
      importLabel: 'Importar',
      importText: '— carga eventos desde cualquier archivo',
      importCode: '.ics',
      importSuffix: '(reemplaza los datos actuales).',
    },

    shortcuts: {
      heading: 'Atajos de teclado',
      helpKbd: '?',
      helpText: '— abrir ayuda.',
      newEventKbd: 'N',
      newEventText: '— crear un nuevo evento.',
      exportKbd: 'X',
      exportText: '— exportar eventos como',
      exportCode: '.ics',
      exportSuffix: '.',
      importKbd: 'I',
      importText: '— importar desde un archivo',
      importCode: '.ics',
      importSuffix: '.',
      escKbd: 'Esc',
      escText: '— cerrar el diálogo actual.',
    },

    other: {
      heading: 'Otros',
      togglePrefix: 'Alternar',
      toggleLabel: 'modo oscuro / claro',
      toggleSuffix: 'con el icono de luna/sol.',
      printLabel: 'Imprimir',
      printText: 'genera una vista limpia optimizada para horizontal.',
      localStorage:
        'Todos los datos se almacenan localmente en su navegador — no se envían a ningún servidor.',
    },
  },

  calendar: {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayAbbrs: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    dateRangeSeparator: '–',
  },
}

export default es
