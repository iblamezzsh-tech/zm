// Optional targeted local lint fix. Only react/no-unescaped-entities diagnostics
// in actual JSX text are repaired, never string literals or attributes.
import {ESLint} from 'eslint';
import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
const eslint=new ESLint(),results=await eslint.lintFiles(['src']);let count=0;
for(const result of results){const matches=result.messages.filter(m=>m.ruleId==='react/no-unescaped-entities');if(!matches.length)continue;const original=readFileSync(result.filePath,'utf8'),ast=ts.createSourceFile(result.filePath,original,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const edits=[];const ranges=[];function walk(node){if(ts.isJsxText(node))ranges.push([node.pos,node.end]);ts.forEachChild(node,walk)}walk(ast);
 for(const m of matches){const pos=ast.getPositionOfLineAndCharacter(m.line-1,m.column-1),char=original[pos],replacement=({"'":"&apos;",'"':'&quot;','>':'&gt;','}':'&#125;'})[char];if(!replacement||!ranges.some(([a,b])=>pos>=a&&pos<b))throw Error('Unsafe lint location: '+result.filePath+':'+m.line);edits.push([pos,replacement]);}
 let updated=original;for(const [i,replacement] of edits.sort((a,b)=>b[0]-a[0]))updated=updated.slice(0,i)+replacement+updated.slice(i+1);writeFileSync(result.filePath,updated);count+=edits.length;
}
console.log('Escaped JSX entity diagnostics:',count);const after=await eslint.lintFiles(['src']);for(const file of after)for(const m of file.messages)console.log(`${file.filePath}:${m.line}:${m.column} ${m.ruleId} ${m.message}`);if(after.some(f=>f.errorCount||f.warningCount))process.exitCode=1;
