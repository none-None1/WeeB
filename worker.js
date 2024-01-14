importScripts('./elvm/8cc.c.eir.js');
var _8cc=main;
importScripts('./elvm/eli.c.eir.js');
var _eli=main;
importScripts('weeb.js');
temp_output="";
var started=0;
function compile(){
    var code=self._code;
    var compiled=Module.compile_weeb(code,0,self._wbp,self._min);
    if(compiled[0]=='L'){
        self.postMessage('\x1bc'+compiled.replaceAll('\n','\r\n')+'\x1b[31m===COMPILATION FAILED===\x1b[0m\r\n');
        return '';
    }
    self.postMessage('\x1bc\x1b[32m===COMPILATION WAS SUCCESSFUL===\x1b[0m\r\n');
    return compiled;
}
function preprocess(c){
    var preprocessed=c.replace(/\#\s*include\s*[\<\"](.*?)[\>\"]/g,function(a,b){
        return preprocess(HEADERS[b]);
    });
    return preprocessed;
}
function compile_getchar(){
    if(inp>=preprocessed.length) return 0;
    var x=preprocessed.charCodeAt(inp);
    inp++;
    return x&255;
}
function input_getchar(){
    if(inp>=irl){
        if(!self.started) self.postMessage('===START EXECUTION===\r\n');
        if(!self.started){
            self.started=1;
            return 0;
        }
        if(inp>=input.length){
            Atomics.wait(ia,0,0);
            for(let i=1;ia[i];i++){
                console.log(ia[i]);
                input+=String.fromCharCode(ia[i]);
            }
            var x=input.charCodeAt(inp);
            inp++;
            return x&255;
        }
    }
    if(inp>=input.length){
        Atomics.wait(ia,0,0);
        for(let i=1;ia[i];i++){
            console.log(ia[i]);
            input+=String.fromCharCode(ia[i]);
        }
    }
    var x=input.charCodeAt(inp);
    inp++;
    return x&255;
}
function putchar_string(x){
    temp_output+=String.fromCharCode(x&255);
}
function term_putchar(x){
    self.postMessage(x==10?'\r\n':String.fromCharCode(x&255));
}
function run_code(){ 
    self.compiledcode=compile();
    if(!compiledcode){
        return;
    }
    var preprocessed=preprocess(compiledcode);
    self.preprocessed=preprocessed;
    self.inp=0;
    _8cc(compile_getchar,putchar_string);
    self.temp_output=temp_output.replace(/\x1b\[1;31m(\[.*?\])\x1b\[0m(.*)/g,function(a,b,c){
        return '';
    });
    self.inp=0;
    self.input=temp_output;
    self.irl=temp_output.length;
    _eli(input_getchar,term_putchar);
    self.postMessage('\r\n===EXECUTION TERMINATED===\r\n');
    console.log('terminate');
}
self.onmessage=function(event){
    console.log('message');
    self.HEADERS=event.data.HEADERS;
    self._wbp=event.data.wbp;
    self._min=event.data.min;
    self._code=event.data._code;
    self.sab=event.data.sab;
    self.ia=new Int32Array(sab);
}
setTimeout(
    run_code,2000
);