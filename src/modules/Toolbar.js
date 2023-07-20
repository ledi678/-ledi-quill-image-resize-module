import IconDelete from './assets/icons/icon-delete.svg';
import IconAlignLeft from './assets/icons/left-alignment.svg';
import IconAlignRight from './assets/icons/right-alignment.svg';
import IconAlignCenter from './assets/icons/center-alignment.svg';
import { BaseModule } from './BaseModule';
// 自定义添加样式
import "./quill.css";


const Parchment = window.Quill.imports.parchment;
const FloatStyle = new Parchment.Attributor.Style('float', 'float');
const MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
const DisplayStyle = new Parchment.Attributor.Style('display', 'display');

export class Toolbar extends BaseModule {
    onCreate = () => {
        // Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

    // The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => { };

    // Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => { };

    _defineAlignments = () => {
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 1em 1em 0');
                },
                isApplied: () => FloatStyle.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    DisplayStyle.add(this.img, 'block');
                    FloatStyle.remove(this.img);
                    MarginStyle.add(this.img, 'auto');

                },
                isApplied: () => MarginStyle.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 1em');

                },
                isApplied: () => FloatStyle.value(this.img) == 'right',
            },
            {
                icon: IconDelete,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                },
                isApplied: () => {
                    return "deleteImg"
                },
            },
        ];
    };

    _addToolbarButtons = () => {
        const buttons = [];
        this.alignments.forEach((alignment, idx) => {
            const button = document.createElement('span');
            const iconEle = document.createElement("img")
            iconEle.setAttribute('src', alignment.icon)
            buttons.push(button);
            button.appendChild(iconEle);
            iconEle.setAttribute('class', "quill-img-icon")

            button.addEventListener('click', () => {
                // deselect all buttons
                buttons.forEach(button => button.style.filter = '');
                if (alignment.isApplied()) {
                    // If applied, unapply
                    FloatStyle.remove(this.img);
                    MarginStyle.remove(this.img);
                    DisplayStyle.remove(this.img);
                } else {
                    // otherwise, select button and apply
                    this._selectButton(button);
                    alignment.apply();

                }
                // 删除图片
                if (alignment.isApplied() == "deleteImg") {
                    this.img.parentNode.removeChild(this.img)
                }
                // image may change position; redraw drag handles
                this.requestUpdate();
            });
            Object.assign(button.style, this.options.toolbarButtonStyles);
            if (idx > 0) {
                button.style.borderLeftWidth = '0';
            }
            Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
            if (alignment.isApplied()) {
                // select button if previously applied
                this._selectButton(button);
            }
            this.toolbar.appendChild(button);
        });
    };

    _selectButton = (button) => {
        button.style.filter = 'invert(20%)';
    };

}
