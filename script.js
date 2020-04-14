function parseTable(res,taboo)
{
	var re = /\d+/;
	res = res.split('<tr');
	category = "";
	category_result =0;
	category_max = 0;
	// grades = {};
	grades = {"":{"practics":[],"result":{"grade":0,"max":0,"weight":0,}}};
	for (i=1;i<res.length;i++)
	{
		tabooInThis = false;
		for (j=0;j<taboo.length;j++)
		{
			if (res[i].toLowerCase().indexOf(taboo[j])!=-1)
			{
				tabooInThis = true;
				break;
			}
		}
		if (tabooInThis) continue;
		
			isCategoryResult = res[i].indexOf('gradeitemdescriptionfiller')!=-1 && res[i].indexOf('level1')==-1;
		isCategoryTitle = res[i].split('<td').length>1 && res[i].split('<td').length<4 && res[i].indexOf('level1')==-1; ;
		isPractic = res[i].split('<td').length>3  && !isCategoryTitle && res[i].indexOf('gradeitemdescriptionfiller')==-1  && res[i].indexOf('level1')==-1;;
		if (isPractic)
		{
			
			title  = res[i].match(/\/>[^<]*</)[0].replace('/>','').replace('<','');
			try
			{
				href   = res[i].match(/href="[^\"]*"/)[0].replace('href="','').replace('"','');
			}
			catch (err)
			{
				href="#";
			}
			
			weight = res[i].match(/column-weight[^>]*>[^<]*</)[0].replace(/column-weight[^>]*>/,'').replace('<','').replace(',','.');
			grade  = res[i].match(/column-grade[^>]*>[^<]*</)[0].replace(/column-grade[^>]*>/,'').replace('<','').replace(',','.');
			max  = res[i].match(/column-range[^>]*>[^<]*</)[0].replace(/column-range[^>]*>/,'').replace('<','').split("&ndash;")[1];
			
			grade = parseFloat(re.exec(grade));
			weight = parseFloat(re.exec(weight));
			max = parseFloat(re.exec(max));
			if (isNaN(weight)) weight = 0;
			if (isNaN(max)) max = 0;
			if (isNaN(grade)) grade = 0;
			
			category_result+=grade;
			category_max+=max;
			grades[category]["practics"].push({"title":title,"href":href,"grade":grade,"max":max,"weight":weight});
		}
		else if (isCategoryTitle)
		{
			// title  = res[i].match(/\/>[^<]*</)[0].replace('/>','').replace('<','');
			// console.log(i,res[i]);
			category = res[i].match(/<\/i>[^<]*</)[0].replace(/<\/i>/,'').replace('<','');
			
			grades[category]={"practics":[],"result":{"grade":0,"max":0,"weight":0,}};
		}
		else if (isCategoryResult)
		{

			category_weight  = res[i].match(/column-range[^>]*>[^<]*</)[0].replace(/column-range[^>]*>/,'').replace('<','').split("&ndash;")[1];
			console.log(category_weight);
			category_weight = parseFloat(re.exec(category_weight));
			if (category == "Дополнительные баллы") category_max = category_weight;
			grades[category]["result"]={"grade":category_result,"weight":category_weight,"max":category_max};
			category = "";
			category_result = 0;
			category_max = 0;
		}
	}
	return grades;
}
function drowGrades(table,grades,colors,brs)
{
	result = 0;
	for (category in grades)
	{

		if (category=="") continue;
		if (grades[category]["practics"].length==0) continue;
		tr = document.createElement('tr');
		tr.className = "table-grade-category-title table-grade-row";
		tr.style.backgroundColor=colors["category-title"];
		tr.innerHTML=`<td colspan="${Object.keys(grades[category]["practics"][0]).length-1}"><b>${category}</b></td>`;
		table.appendChild(tr);
		
		for (i=0;i<grades[category]["practics"].length;i++)
		{
			title  = grades[category]["practics"][i]["title"];
			grade  = grades[category]["practics"][i]["grade"];
			max    = grades[category]["practics"][i]["max"];
			weight = grades[category]["practics"][i]["weight"];
			tr = document.createElement('tr');
			tr.className = "table-grade-practic table-grade-row";
			tr.style.backgroundColor=colors["practic"][i%2];
			tr.innerHTML=`<td><a href = "${href}">${title}</a></td><td>${grade}</td><td>${max}</td><td>${weight}%</td>`;
			table.appendChild(tr);
		}
		title  = `Итого в категории "${category}"`;
		grade  = grades[category]["result"]["grade"];
		max    = grades[category]["result"]["max"];
		weight = grades[category]["result"]["weight"];
		if (max!=0) result += (grade - (grade%max)*(grade/max>1))*weight/max ;
		tr = document.createElement('tr');
		tr.className = "table-grade-category-result table-grade-row";
		tr.style.backgroundColor=colors["category-result"];
		tr.innerHTML=`<td><b>${title}</b></td><td>${grade}</td><td>${max}</td><td>${weight}%</td>`;
		table.appendChild(tr);
	}
	if (grades[""]["practics"].length!=0)
	{
		category="";
		for (i=0;i<grades[""]["practics"].length;i++)
		{
			title  = grades[category]["practics"][i]["title"];
			grade  = grades[category]["practics"][i]["grade"];
			max    = grades[category]["practics"][i]["max"];
			weight = grades[category]["practics"][i]["weight"];
			href   = grades[category]["practics"][i]["href"];
			if (max!=0) result +=(grade*weight/max);
			tr = document.createElement('tr');
			tr.className = "table-grade-practic table-grade-row";
			tr.style.backgroundColor=colors["practic"][i%2];
			tr.innerHTML=`<td><a href = "${href}">${title}</a></td><td>${grade}</td><td>${max}</td><td>${weight}%</td>`;
			table.appendChild(tr);
		}
	}
	// result = 10.8;
	tr = document.createElement('tr');
	tr.className = "table-grade-result table-grade-row";
	tr.style.backgroundColor=colors["category-result"];
	k=0;
	color = "";
	comment = "";
	for (finalGrade in brs)
	{
		if (result<brs[finalGrade])
		{
			if (Object.keys(brs).length==2)
			color = colors["final"][(k%3)*3];
		else
			color = colors["final"][k];
			comment = finalGrade;
			break;
		}
		else
		{
			k++;
		}
	}
	console.log(color);
	tr.innerHTML=`<td><b>Итог</b></td><td style="background-color:${color};" colspan="3">${result.toFixed(2)} ${comment}</td>`;
	table.appendChild(tr);
}