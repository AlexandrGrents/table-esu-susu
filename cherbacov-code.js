
var global_mbrs_tkmax=0;
function mbrsparsefloat(v){if(v=='-')return 0;var ve=v.split(',');if(ve.length>1)return parseFloat(ve[0]+'.'+ve[1]);else return parseFloat(v);}
var mbrs_xhr=new XMLHttpRequest();mbrs_xhr.open("GET","/grade/report/user/index.php?id=34092",true);
mbrs_xhr.send();mbrs_xhr.onreadystatechange=function()
{
	if(mbrs_xhr.readyState==4)
	if(mbrs_xhr.status==200)
		{var mbrs_r=mbrs_xhr.responseText;
		var mbrs_fktxt,mbrs_xmax,i,spz,spi,spg,sps,spw,spr,sp=mbrs_r.split('class="gradeitemheader"'),spc,omc,oms,omw,omr,mbrs_r_tkmax=0,mbrs_r_pamax=0,mbrs_r_bmax=0,mbrs_r_krmax=0,mbrs_r_tk=0,mbrs_r_pa=0,mbrs_r_fk=0,mbrs_r_b=0,mbrs_r_kr=0;
		for(i=1;i<sp.length;i++){
			spz=sp[i].split('/mod/assign/view.php?id=');
			spi=0;
			if(spz.length<=1){
				spz=sp[i].split('https://edu.susu.ru/mod/quiz/grade.php?id=');
				if(spz.length<=1){
					continue;
				}
				spi=parseInt(spz[1].split('&')[0]);
			}else {
				spi=parseInt(spz[1].split('"')[0]);
			}
			spz=sp[i].split('column-grade')[1];
			spz=spz.split('>')[1];
			spg=mbrsparsefloat(spz.split('</td')[0]);

			oms=document.getElementById("mbrss"+spi);
			if(!oms)continue;
			omc=document.getElementById("mbrsc"+spi);
			omw=document.getElementById("mbrsw"+spi);
			omr=document.getElementById("mbrsr"+spi);

			sps=mbrsparsefloat(oms.innerHTML);
			spw=mbrsparsefloat(omw.innerHTML);
			spc=parseInt(omc.innerHTML);
			omr.innerHTML = Math.ceil(100.0*spg/sps)+"%";
			oms.innerHTML = spg+" из "+sps;
			if(spc==1) {mbrs_r_tk+=spw*spg/sps; mbrs_r_tkmax+=spw;}
			if(spc==2) {mbrs_r_pa+=spw*spg/sps; mbrs_r_pamax+=spw;}
			if(spc==3) {mbrs_r_b+=spw*spg/sps; mbrs_r_bmax+=spw;}
			if(spc==4) {mbrs_r_kr+=spw*spg/sps; mbrs_r_krmax+=spw;}
		}
if(mbrs_r_tkmax) mbrs_r_tk = Math.ceil(100.0*mbrs_r_tk/mbrs_r_tkmax); else mbrs_r_tk=0;
if(mbrs_r_pamax) mbrs_r_pa = Math.ceil(100.0*mbrs_r_pa/mbrs_r_pamax); else mbrs_r_pa=0;
if(mbrs_r_krmax) mbrs_r_kr = Math.ceil(100.0*mbrs_r_kr/mbrs_r_krmax); else mbrs_r_kr=0;

if(mbrs_r_tkmax)
for(i=1;i<sp.length;i++){
	spz=sp[i].split('/mod/assign/view.php?id=');
	spi=0;
	if(spz.length<=1){
		spz=sp[i].split('https://edu.susu.ru/mod/quiz/grade.php?id=');
		if(spz.length<=1){
			continue;
		}
		spi=parseInt(spz[1].split('&')[0]);
	}else {
		spi=parseInt(spz[1].split('"')[0]);
	}
	spz=sp[i].split('column-grade')[1];
	spz=spz.split('>')[1];
	spg=mbrsparsefloat(spz.split('</td')[0]);

	oms=document.getElementById("mbrss"+spi);
	if(!oms)continue;
	omc=document.getElementById("mbrsc"+spi);
	omw=document.getElementById("mbrsw"+spi);
	omr=document.getElementById("mbrsr"+spi);

	sps=mbrsparsefloat(oms.innerHTML.split(' ')[2]);
	spw=mbrsparsefloat(omw.innerHTML);
	spc=parseInt(omc.innerHTML);
	mbrs_xmax=1;
	if(spc==1) {mbrs_xmax=mbrs_r_tkmax;}
	if(spc==2) {mbrs_xmax=mbrs_r_pamax;}
	if(spc==3) {mbrs_xmax=mbrs_r_bmax;}
	if(spc==4) {mbrs_xmax=mbrs_r_krmax;}

	if(sps){
		omr.innerHTML = Math.ceil(10000.0*spw*spg/sps/mbrs_xmax)/100+"%";
		oms.innerHTML = spg+" из "+sps+" ("+Math.ceil(10000.0*spg/sps)/100+"%)";
	}
}

document.getElementById("mbrs_r_tk").innerHTML = mbrs_r_tk+"%";
document.getElementById("mbrs_r_pa").innerHTML = mbrs_r_pa+"%";

var mbrs_r_fk1 = mbrs_r_tk;
var mbrs_r_fk2 = 0.6*mbrs_r_tk+0.4*mbrs_r_pa;

global_mbrs_tkmax = mbrs_r_tkmax;

if(document.getElementById("mbrs_pa_need")){
	mbrs_r_fk = mbrs_r_fk2;
} else {
	if(mbrs_r_fk2>mbrs_r_fk1)
		mbrs_r_fk = mbrs_r_fk2;
	else
		mbrs_r_fk = mbrs_r_fk1;
}

if(mbrs_r_bmax)	mbrs_r_b = Math.ceil(100.0*mbrs_r_b / mbrs_r_bmax); else mbrs_r_b=0;
if(mbrs_r_b>15)mbrs_r_b=15;

mbrs_r_fk += mbrs_r_b;
mbrs_fktxt = "";
mbrs_fktxt="неудовл.";if(mbrs_r_fk>=60)mbrs_fktxt="удовл.";if(mbrs_r_fk>=75)mbrs_fktxt="хорошо";if(mbrs_r_fk>=85)mbrs_fktxt="отлично";
omfk=document.getElementById("mbrs_r_fk");
if(mbrs_r_fk>100)
	omfk.innerHTML = "<span title=\""+mbrs_r_fk+"\">100+%&nbsp;("+mbrs_fktxt+")</span>";
else
	omfk.innerHTML = mbrs_r_fk+"%&nbsp;("+mbrs_fktxt+")";
if(mbrs_r_fk>=60)omfk.style.backgroundColor='#E0FFE0';
else omfk.style.backgroundColor='#FFE0E0';

if(document.getElementById("mbrs_b_4")){
	omfk=document.getElementById("mbrs_r_kr");
	mbrs_fktxt="неудовл.";if(mbrs_r_kr>=60)mbrs_fktxt="удовл.";if(mbrs_r_kr>=75)mbrs_fktxt="хорошо";if(mbrs_r_kr>=85)mbrs_fktxt="отлично";
	omfk.innerHTML = mbrs_r_kr+"%&nbsp;("+mbrs_fktxt+")";
	if(mbrs_r_kr>=60)omfk.style.backgroundColor='#E0FFE0';
	else omfk.style.backgroundColor='#FFE0E0';
}
/\<\>/
}}
