class VirtualNode {
    constructor(tag, props = {}, children = [], directives = {}, context = {}) {
        this.tag = tag;
        this.props = props;
        this.children = children;
        this.directives = directives;
        this.context = context;
    }
}

const evaluateDirective = (expression, context) => {
    try {
        return new Function(...Object.keys(context), `return ${expression}`)(...Object.values(context));
    } catch (e) {
        console.error('Error evaluating directive:', expression, e);
        return false;
    }
}
const handleVFor = (vnode, element) => {
    const { items, template } = vnode.directives['v-for'];
    const itemsArray = evaluateDirective(items, vnode.context);
    
    if (!Array.isArray(itemsArray)) {
        console.error('v-for directive expects an array, but got:', itemsArray);
        return;
    }
    // console.log(itemsArray)
    itemsArray.forEach((item, index) => {
        // Create a new context for each item with item and index
        
        const itemContext = { ...vnode.context, item, index };
        // console.log(itemContext)
        // Process children with the current itemContext
        console.log(template.children)
        const processedChildren = template.children.map(child => processChild(child, itemContext));
        // console.log(processedChildren)
        // Create a new VNode for each item with processed children
        const itemVNode = new VirtualNode(
            template.tag,
            template.props,
            processedChildren, // Use processed children here
            template.directives,
            itemContext
        );
        // Create the DOM element for the VNode
        // console.log(processedChildren)
        // console.log(itemVNode)
        const childElement = createElement(itemVNode);
        if (childElement) {
            element.appendChild(childElement);
        } else {
            console.error('Failed to create element for vnode:', itemVNode);
        }
    });
};




const processChild = (child, context) => {
    console.log("func called")
    if (typeof child === 'string') {
      // Check if the string contains interpolation syntax
      if (child.includes('{{')) {
        // Replace interpolation syntax with actual value from context
        return child.replace(/{{(.*?)}}/g, (_, key) => context[key] || '');
      } else {
        return child;
      }
    } else if (child instanceof VirtualNode) {
      // Recursively process child nodes if they are VirtualNodes
      return new VirtualNode(
        child.tag,
        child.props,
        child.children.map(c => processChild(c, context)),
        child.directives,
        child.context
      );
    }
    return child;
  };
  




const evaluateExpression = (expression, context) => {
    try {
        return new Function(...Object.keys(context), `return ${expression}`)(...Object.values(context));
    } catch (e) {
        console.error('Error evaluating expression:', expression, e);
        return '';
    }
}


const handleVIf = (vnode) => {
    const shouldRender = evaluateDirective(vnode.directives['v-if'], vnode.context);
    return shouldRender ? vnode : null;
}

const createElement = (vnode) => {
    if (!vnode) return document.createComment('empty');

    if (typeof vnode === 'string') return document.createTextNode(vnode);

    if (!(vnode instanceof VirtualNode)) {
        console.error('Invalid vnode:', vnode);
        return document.createComment('invalid node');
    }

    // Handle v-if
    if (vnode.directives['v-if']) {
        const shouldRender = evaluateDirective(vnode.directives['v-if'], vnode.context);
        if (!shouldRender) return document.createComment('v-if');
    }

    const element = document.createElement(vnode.tag);

    // Set attributes
    Object.entries(vnode.props).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    // Handle v-for
    if (vnode.directives['v-for']) {
        handleVFor(vnode, element);
    } else {
        vnode.children.forEach(child => {
            
            const childNode = createElement(child);
            console.log(childNode)
            if (childNode) {
            element.appendChild(childNode);
            // console.log(element)
            }
        });
    }

    return element;
}

  
const updateElement = (parent, newVNode, oldVNode, index = 0) => {
    if (!oldVNode) {
        parent.appendChild(createElement(newVNode));
    } else if (!newVNode) {
        parent.removeChild(parent.childNodes[index]);
    } else if (changes(newVNode, oldVNode)) {
        parent.replaceChild(createElement(newVNode), parent.childNodes[index]);
    } else if (newVNode.tag) {
        const el = parent.childNodes[index];
        const newLength = newVNode.children.length;
        const oldLength = oldVNode.children.length;

        for (let i = 0; i < Math.max(newLength, oldLength); i++) {
            updateElement(el, newVNode.children[i], oldVNode.children[i], i);
        }
    }

    // v-if is now handled in createElement, so we don't need to handle it here
}

const changes = (vnode1, vnode2) => {
    return (typeof vnode1 !== typeof vnode2) ||
           (typeof vnode1 === 'string' && vnode1 !== vnode2) ||
           (vnode1.tag !== vnode2.tag);
}

const render = (vnode, rootElement) => {
    const oldVNode = rootElement.vnode;
    rootElement.vnode = vnode;
    updateElement(rootElement, vnode, oldVNode);
}

function html(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    function nodeToVNode(node, context = {}) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
    
        const tag = node.nodeName.toLowerCase();
        const attrs = {};
        const directives = {};
    
        Array.from(node.attributes).forEach(attr => {
            if (attr.name.startsWith('v-')) {
                if (attr.name === 'v-for') {
                    const [itemAndIndex, items] = attr.value.split(' in ').map(s => s.trim());
                    const [item, index] = itemAndIndex.replace(/[()]/g, '').split(',').map(s => s.trim());
                    directives['v-for'] = {
                        items: items,
                        template: new VirtualNode(tag, attrs, Array.from(node.childNodes).map(child => nodeToVNode(child, context)))
                    };
                } else {
                    directives[attr.name] = attr.value;
                }
            } else {
                attrs[attr.name] = attr.value;
            }
        });
    
        const children = Array.from(node.childNodes).map(child => {
            const childVNode = nodeToVNode(child, context);
            // console.log('Child node to vnode:', child, '=>', childVNode); // Check this
            return childVNode;
        });
        // console.log('Children for tag', tag, ':', children); // Check this
    
        return new VirtualNode(tag, attrs, children, directives, context);
    }
    
    
      

    const rootNodes = Array.from(doc.body.childNodes);
    if (rootNodes.length === 1) {
        return nodeToVNode(rootNodes[0]);
    } else {
        return new VirtualNode('div', {}, rootNodes.map(node => nodeToVNode(node)));
    }
}
window.html = html;

const extractComponents = (text) => {
    const htmlStartTag = '<xen>';
    const htmlEndTag = '</xen>';
    const cssStartTag = '<style>';
    const cssEndTag = '</style>';
    const jsStartTag = '<script>';
    const jsEndTag = '</script>';

    const htmlStart = text.indexOf(htmlStartTag);
    const htmlEnd = text.indexOf(htmlEndTag);
    const htmlContent = htmlStart !== -1 && htmlEnd !== -1
        ? text.substring(htmlStart + htmlStartTag.length, htmlEnd).trim()
        : '';

    const cssStart = text.indexOf(cssStartTag);
    const cssEnd = text.indexOf(cssEndTag);
    const cssContent = cssStart !== -1 && cssEnd !== -1
        ? text.substring(cssStart + cssStartTag.length, cssEnd).trim()
        : '';

    const jsStart = text.indexOf(jsStartTag);
    const jsEnd = text.indexOf(jsEndTag);
    const jsContent = jsStart !== -1 && jsEnd !== -1
        ? text.substring(jsStart + jsStartTag.length, jsEnd).trim()
        : '';

    return { htmlContent, css: cssContent, js: jsContent };
};

const extractScriptVariables = (text) => {
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    let variables = '';

    while ((match = scriptRegex.exec(text)) !== null) {
        if (!variables) {
            variables += match[1];
        }
    }

    const variableRegex = /const\s+(\w+)\s*=\s*([^;]*);/g;
    let variableMatch;

    let contextVariables = '';
    while ((variableMatch = variableRegex.exec(variables)) !== null) {
        contextVariables += `var ${variableMatch[1]} = ${variableMatch[2]};\n`;
    }

    return contextVariables;
};

const processVariables = (htmlContent, context) => {
    return htmlContent.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] || '');
};

const loadComponent = async (url) => {
    const response = await fetch(url);
    const text = await response.text();

    const { htmlContent, css, js } = extractComponents(text);
    const scriptContent = extractScriptVariables(text);

    const context = {};
    new Function('context', `
        with (context) {
            ${scriptContent}
        }
    `)(context);

    const processedHtmlContent = processVariables(htmlContent, context);

    const component = { html: processedHtmlContent, css };

    if (js) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = `
            ${scriptContent}
            
            class Component {
                constructor() {
                    this.context = ${JSON.stringify(context)};
                }
                render() {
                    return html(\`${processedHtmlContent}\`);
                }
            }
            window.__componentClass = Component;
        `;
        document.head.appendChild(script);

        component.js = window.__componentClass;
        delete window.__componentClass;
    }

    return { ...component, context };
};

const renderComponent = async (selector, url) => {
    const { context, ...component } = await loadComponent(url);

    if (component.css) {
        const styleElement = document.createElement('style');
        styleElement.textContent = component.css;
        document.head.appendChild(styleElement);
    }

    const instance = new component.js();
    const vnode = instance.render();

    const rootElement = document.getElementById(selector);
    render(vnode, rootElement);
};

export { render, html, renderComponent };