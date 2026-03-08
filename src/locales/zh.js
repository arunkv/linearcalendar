/**
 * Mandarin Chinese (简体中文) locale strings for Linear Calendar.
 */

const zh = {
  appName: '线性日历',

  /** Browser tab title. */
  pageTitle: year => `${year}年 — 线性日历`,

  header: {
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到深色模式',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    help: '帮助',
    install: '安装',
    installTitle: '安装应用',
    export: '导出',
    exportTitle: '导出事件为 .ics 文件',
    import: '导入',
    importTitle: '从 .ics 文件导入事件',
    clear: '清空',
    clearTitle: '清空所有事件和标签',
    print: '打印',
    printTitle: '打印日历',
  },

  footer: {
    /** @param {number} year */
    copyright: year => `© ${year} Arun K Viswanathan`,
    builtWith: '使用',
  },

  toast: {
    updateAvailable: '有新版本可用。',
    reload: '重新加载',
  },

  yearSwitcher: {
    prevYear: '上一年',
    nextYear: '下一年',
    enterYear: '输入年份',
    cancelYear: '取消自定义年份',
    cancelTitle: '取消',
    selectYear: '选择年份',
    customOption: '输入年份…',
  },

  yearPicker: {
    subtitle: '选择一个年份开始使用',
    prevYear: '上一年',
    yearLabel: '年份',
    nextYear: '下一年',
    viewCalendar: '查看日历 →',
  },

  eventModal: {
    newEvent: '新建事件',
    editEvent: '编辑事件',
    close: '关闭',
    titleLabel: '标题',
    titlePlaceholder: '事件标题',
    startLabel: '开始',
    endLabel: '结束',
    tagLabel: '标签',
    tagNone: '无',
    newTagTrigger: '+ 新建标签',
    tagNamePlaceholder: '标签名称',
    createTag: '创建',
    cancel: '取消',
    save: '保存',
    deleteEvent: '删除',
  },

  tagFilterBar: {
    label: '标签：',
    tagNamePlaceholder: '标签名称',
    save: '保存',
    cancel: '取消',
    /** @param {string} name */
    editTag: name => `编辑标签 ${name}`,
    /** @param {string} name */
    deleteTag: name => `删除标签 ${name}`,
  },

  clearDialog: {
    ariaLabel: '清空日历确认',
    title: '清空日历？',
    bodyPrefix: '这将永久删除',
    /** @param {number} n */
    eventCount: n => `${n} 个事件`,
    bodyAnd: '和',
    /** @param {number} n */
    tagCount: n => `${n} 个标签`,
    bodySuffix: '此操作无法撤销。',
    exportHint: '💡 建议在清空前导出您的数据。',
    exportFirst: '先导出',
    cancel: '取消',
    confirm: '清空所有',
  },

  deleteTagDialog: {
    ariaLabel: '删除标签确认',
    /** @param {string|undefined} name */
    title: name => (name ? `删除标签「${name}」？` : '删除标签？'),
    /** @param {number} n */
    eventCount: n => `${n} 个事件`,
    usesTag: '使用了此标签。该标签将从',
    singularRef: '该事件',
    pluralRef: '这些事件',
    bodySuffix: '中移除并删除。',
    cancel: '取消',
    confirm: '删除标签',
  },

  importError: {
    invalidType: '无效的文件类型 — 请选择 .ics 文件。',
    noEvents: '文件中未找到有效事件。',
    tooLarge: '文件过大（最大 5 MB）。',
    parseFailed: '无法解析 .ics 文件。',
  },

  helpModal: {
    ariaLabel: '帮助',
    title: '欢迎使用线性日历',
    close: '关闭',
    intro: '一种全年一览的日历，每个月显示为一行。',
    gotIt: '明白了',

    gettingStarted: {
      heading: '开始使用',
      addEvent: '添加事件',
      addEventText: '— 点击日历上的任意日期单元格。',
      editEvent: '编辑或删除事件',
      editEventText: '— 点击彩色的事件条。',
      changeYear: '更改年份',
      changeYearText: '— 使用标题栏中的年份切换器，或添加书签',
      changeYearCode: '?year=2025',
      changeYearSuffix: '。',
    },

    tags: {
      heading: '标签',
      assignPrefix: '为事件分配一个',
      assignTag: '标签',
      assignSuffix: '（带颜色）以便于分组。',
      createInline: '在添加或编辑事件时内联创建标签。',
      toggleVisibility: '从标题栏下方的筛选栏切换标签可见性。',
    },

    importExport: {
      heading: '导入与导出',
      exportLabel: '导出',
      exportText: '— 将所有事件下载为标准',
      exportCode: '.ics',
      exportSuffix: '文件。',
      importLabel: '导入',
      importText: '— 从任何',
      importCode: '.ics',
      importSuffix: '文件加载事件（将替换当前数据）。',
    },

    shortcuts: {
      heading: '键盘快捷键',
      helpKbd: '?',
      helpText: '— 打开帮助。',
      newEventKbd: 'N',
      newEventText: '— 创建新事件。',
      exportKbd: 'X',
      exportText: '— 导出事件为',
      exportCode: '.ics',
      exportSuffix: '文件。',
      importKbd: 'I',
      importText: '— 从',
      importCode: '.ics',
      importSuffix: '文件导入。',
      escKbd: 'Esc',
      escText: '— 关闭当前对话框。',
    },

    other: {
      heading: '其他',
      togglePrefix: '点击月亮/太阳图标',
      toggleLabel: '切换深色/浅色模式',
      toggleSuffix: '。',
      printLabel: '打印',
      printText: '可生成干净的横向优化视图。',
      localStorage: '所有数据都存储在您的浏览器本地 — 不会发送到服务器。',
    },
  },

  calendar: {
    months: [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月',
    ],
    dayAbbrs: ['日', '一', '二', '三', '四', '五', '六'],
    dateRangeSeparator: '–',
  },
}

export default zh
