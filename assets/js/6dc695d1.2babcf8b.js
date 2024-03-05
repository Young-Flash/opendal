"use strict";(self.webpackChunkopendal_website=self.webpackChunkopendal_website||[]).push([[5982],{3335:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>d,default:()=>f,frontMatter:()=>o,metadata:()=>u,toc:()=>h});var a=n(1527),s=n(2175);function i(e){const t={code:"code",del:"del",h2:"h2",h3:"h3",input:"input",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h2,{id:"capabilities",children:"Capabilities"}),"\n",(0,a.jsx)(t.p,{children:"This service can be used to:"}),"\n",(0,a.jsxs)(t.ul,{className:"contains-task-list",children:["\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",checked:!0,disabled:!0})," stat"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",checked:!0,disabled:!0})," read"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",checked:!0,disabled:!0})," write"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",checked:!0,disabled:!0})," create_dir"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",checked:!0,disabled:!0})," delete"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",disabled:!0})," copy"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",disabled:!0})," rename"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",disabled:!0})," ",(0,a.jsx)(t.del,{children:"list"})]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",disabled:!0})," scan"]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",disabled:!0})," ",(0,a.jsx)(t.del,{children:"presign"})]}),"\n",(0,a.jsxs)(t.li,{className:"task-list-item",children:[(0,a.jsx)(t.input,{type:"checkbox",disabled:!0})," blocking"]}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"configuration",children:"Configuration"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"root"}),": Set the working directory of ",(0,a.jsx)(t.code,{children:"OpenDAL"})]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"token"}),": Set the token of cloudflare api"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"account_id"}),": Set the account id of cloudflare api"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"database_id"}),": Set the database id of cloudflare api"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"table"}),": Set the table of D1 Database"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"key_field"}),": Set the key field of D1 Database"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"value_field"}),": Set the value field of D1 Database"]}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,a.jsx)(t.h3,{id:"via-builder",children:"Via Builder"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-rust",children:'use anyhow::Result;\nuse opendal::services::D1;\nuse opendal::Operator;\n\n#[tokio::main]\nasync fn main() -> Result<()> {\n    let mut builder = D1::default();\n    builder\n        .token("token")\n        .account_id("account_id")\n        .database_id("database_id")\n        .table("table")\n        .key_field("key_field")\n        .value_field("value_field");\n\n    let op = Operator::new(builder)?.finish();\n    Ok(())\n}\n'})})]})}function l(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(i,{...e})}):i(e)}var r=n(5431),c=n(2860);const o={title:"D1"},d=void 0,u={id:"services/d1",title:"D1",description:"D1 services support.",source:"@site/docs/services/d1.mdx",sourceDirName:"services",slug:"/services/d1",permalink:"/docs/services/d1",draft:!1,unlisted:!1,editUrl:"https://github.com/apache/opendal/tree/main/website/docs/services/d1.mdx",tags:[],version:"current",lastUpdatedBy:"Flash",lastUpdatedAt:1709640325,formattedLastUpdatedAt:"Mar 5, 2024",frontMatter:{title:"D1"},sidebar:"docs",previous:{title:"COS",permalink:"/docs/services/cos"},next:{title:"DashMap",permalink:"/docs/services/dashmap"}},p={},h=[{value:"Via Config",id:"via-config",level:3}];function b(e){const t={a:"a",code:"code",h3:"h3",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"https://developers.cloudflare.com/d1/",children:"D1"})," services support."]}),"\n","\n",(0,a.jsx)(l,{components:e.components}),"\n",(0,a.jsx)(t.h3,{id:"via-config",children:"Via Config"}),"\n","\n","\n",(0,a.jsxs)(r.Z,{children:[(0,a.jsx)(c.Z,{value:"rust",label:"Rust",default:!0,children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-rust",children:'use anyhow::Result;\nuse opendal::Operator;\nuse opendal::Scheme;\nuse std::collections::HashMap;\n\n#[tokio::main]\nasync fn main() -> Result<()> {\n    let mut map = HashMap::new();\n    map.insert("token".to_string(), "token".to_string());\n    map.insert("account_id".to_string(), "account_id".to_string());\n    map.insert("database_id".to_string(), "database_id".to_string());\n    map.insert("table".to_string(), "table".to_string());\n    map.insert("key_field".to_string(), "key_field".to_string());\n    map.insert("value_field".to_string(), "value_field".to_string());\n\n    let op: Operator = Operator::via_map(Scheme::D1, map)?;\n    Ok(())\n}\n'})})}),(0,a.jsx)(c.Z,{value:"node.js",label:"Node.js",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'import { Operator } from "opendal";\n\nasync function main() {\n    const config = {\n        token: "token",\n        account_id: "account_id",\n        database_id: "database_id",\n        table: "table",\n        key_field: "key_field",\n        value_field: "value_field"\n    };\n    const op = new Operator("d1", config);\n}\n'})})}),(0,a.jsx)(c.Z,{value:"python",label:"Python",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:'import opendal\n\nconfig = {\n    "token": "token",\n    "account_id": "account_id",\n    "database_id": "database_id",\n    "table": "table",\n    "key_field": "key_field",\n    "value_field": "value_field"\n}\n\nop = opendal.Operator("d1", **config)\n'})})})]})]})}function f(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(b,{...e})}):b(e)}},2860:(e,t,n)=>{n.d(t,{Z:()=>l});n(959);var a=n(6259);const s={tabItem:"tabItem_CbVR"};var i=n(1527);function l(e){let{children:t,hidden:n,className:l}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,a.Z)(s.tabItem,l),hidden:n,children:t})}},5431:(e,t,n)=>{n.d(t,{Z:()=>_});var a=n(959),s=n(6259),i=n(2990),l=n(8903),r=n(3133),c=n(563),o=n(351),d=n(3026);function u(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:s}}=e;return{value:t,label:n,attributes:a,default:s}}))}(n);return function(e){const t=(0,o.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function b(e){let{queryString:t=!1,groupId:n}=e;const s=(0,l.k6)(),i=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c._X)(i),(0,a.useCallback)((e=>{if(!i)return;const t=new URLSearchParams(s.location.search);t.set(i,e),s.replace({...s.location,search:t.toString()})}),[i,s])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:s}=e,i=p(e),[l,c]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:i}))),[o,u]=b({queryString:n,groupId:s}),[f,m]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,i]=(0,d.Nk)(n);return[s,(0,a.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:s}),x=(()=>{const e=o??f;return h({value:e,tabValues:i})?e:null})();(0,r.Z)((()=>{x&&c(x)}),[x]);return{selectedValue:l,selectValue:(0,a.useCallback)((e=>{if(!h({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),m(e)}),[u,m,i]),tabValues:i}}var m=n(3499);const x={tabList:"tabList_zxWd",tabItem:"tabItem_TcdJ"};var j=n(1527);function v(e){let{className:t,block:n,selectedValue:a,selectValue:l,tabValues:r}=e;const c=[],{blockElementScrollPositionUntilNextRender:o}=(0,i.o5)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),s=r[n].value;s!==a&&(o(t),l(s))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":n},t),children:r.map((e=>{let{value:t,label:n,attributes:i}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:a===t?0:-1,"aria-selected":a===t,ref:e=>c.push(e),onKeyDown:u,onClick:d,...i,className:(0,s.Z)("tabs__item",x.tabItem,i?.className,{"tabs__item--active":a===t}),children:n??t},t)}))})}function k(e){let{lazy:t,children:n,selectedValue:s}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===s));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function g(e){const t=f(e);return(0,j.jsxs)("div",{className:(0,s.Z)("tabs-container",x.tabList),children:[(0,j.jsx)(v,{...e,...t}),(0,j.jsx)(k,{...e,...t})]})}function _(e){const t=(0,m.Z)();return(0,j.jsx)(g,{...e,children:u(e.children)},String(t))}},2175:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>l});var a=n(959);const s={},i=a.createContext(s);function l(e){const t=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),a.createElement(i.Provider,{value:t},e.children)}}}]);