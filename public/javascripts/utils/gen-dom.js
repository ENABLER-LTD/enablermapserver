class GenDOM {
    constructor() {
    }

    createTreeNode(parent,
                   text = '',
                   indent = 1,
                   svgIcon = '',
                   checkboxFlag = false,
                   color = '',
                   menu = false,
                   menuOpts = {},
                   checkOpts = {}
    ) {
        // peer node
        const ele_node = document.createElement('div')
        ele_node.classList.add('peer-node')
        ele_node.classList.add(`level-${indent}`)
        ele_node.style.display = indent == 1 ? 'block' : 'none'
        if (indent === 1) {
            ele_node.style.display = 'block'
        }
        // Indent Block
        for (let i = 0; i < indent; i++) {
            if (i === 0) continue
            const ele_indentBox = document.createElement('div')
            ele_indentBox.classList.add('indentation-box')
            ele_node.appendChild(ele_indentBox)
        }
        // icon
        const ele_svgIcon = document.createElement('div')
        ele_svgIcon.classList.add('icon-svg')
        ele_svgIcon.innerHTML = svgIcon
        ele_node.appendChild(ele_svgIcon)
        // checkbox
        const ele_checkbox = document.createElement('div')
        // ele_checkbox.type = 'checkbox'
        ele_checkbox.classList.add('checkbox')
        if (checkboxFlag) {
            const ele_img = document.createElement('img')
            ele_img.src = '/icon/correct.png'
            ele_img.classList.add('checkbox-img')
            ele_checkbox.appendChild(ele_img)
            ele_checkbox[`on${checkOpts.handlerName}`] = checkOpts.event
            ele_checkbox.bindData = checkOpts.bindData
        }
        ele_node.appendChild(ele_checkbox)
        // text
        const ele_text = document.createElement('div')
        ele_text.classList.add('node-text')
        if (text) {
            const ele_textItem = document.createElement('span')
            ele_textItem.classList.add('node-text-name')
            ele_textItem.appendChild(document.createTextNode(text))
            ele_text.appendChild(ele_textItem)
        }
        ele_node.appendChild(ele_text)
        // color
        if (color) {
            const ele_textColor = document.createElement('div')
            ele_textColor.classList.add('node-text-color')
            ele_textColor.style.backgroundColor = color
            ele_node.appendChild(ele_textColor)
        }
        // menu
        if (menu) {
            const ele_menuBtn = document.createElement('div')
            ele_menuBtn.classList.add('menu-btn-box')
            // menu incident
            ele_menuBtn[`on${menuOpts.handlerName}`] = menuOpts.event
            ele_menuBtn.bindData = menuOpts.bindData
            ele_menuBtn.innerHTML = `
        <img src="./icon/menu-icons/meun.svg" alt="" class="menu-btn">
        <div class="menu-options-btn" style="display: none;">
            <ul>
                <li>
                    <img src="./icon/menu-icons/Historydisplay-blue.svg" alt=""> 
                    <a href="#" class="resume-display-btn"><span>過去履歴表示</span></a>
                </li>
                <li class="updateuserbtn">
                    <img src="./icon/menu-icons/user-setting-blue.svg" alt="">
                    <a class="urlset"><span>ユーザー編集</span></a>
                </li>
            </ul>
        </div>
      `
            ele_node.appendChild(ele_menuBtn)
        }

        parent.appendChild(ele_node)
    }
}
