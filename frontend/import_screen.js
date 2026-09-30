const fs = require('fs');
let html = fs.readFileSync('C:/Users/Lotus Group/.gemini/antigravity/brain/8c19d0f7-f5e6-400f-93e1-6d8662792281/.system_generated/steps/848/content.md', 'utf8');

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

if(bodyMatch){ 
    let content = bodyMatch[1]; 
    content = content.replace(/class=/g, 'className='); 
    content = content.replace(/<!--[\s\S]*?-->/g, ''); 
    content = content.replace(/<hr>/g, '<hr />'); 
    content = content.replace(/<br>/g, '<br />'); 
    content = content.replace(/<img([^>]+)>/g, (m,p1)=> p1.endsWith('/') ? m : '<img' + p1 + ' />'); 
    
    // Any style="..." strings need to be converted to objects if present.
    // For safety, let's just strip inline styles if they are simple or manually handle them.
    content = content.replace(/style="([^"]+)"/g, ''); // just remove them for this demo

    fs.mkdirSync('src/app/flow', {recursive: true}); 
    const component = `
import React from 'react';

export default function UserFlowDiagram() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-auto p-8">
      ${content}
    </div>
  );
}
`; 
    fs.writeFileSync('src/app/flow/page.tsx', component); 
    console.log('Successfully created src/app/flow/page.tsx'); 
} else { 
    console.log('No body found'); 
}
