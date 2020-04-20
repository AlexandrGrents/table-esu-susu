function parseTable(res,taboo,byzero,frozenmax,convert)
{
	var re = /\d+/;
	var inByzeroo;
	res = res.split('<tr');
	category = "";
	category_result =0;
	category_max = 0;
	category_weight = 0;
	isCategoryResult = 0;
	categoryResultBeforePractics = false;
	lastCategory = "";
	// grades = {};
	grades = {"categories":{"":{"practics":[],"result":{"grade":0,"max":0,"weight":0,}}},
	"result":{"grade":0}};
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
		lastIsCategoryResult = isCategoryResult;
		isCategoryResult = res[i].indexOf('gradeitemdescriptionfiller')!=-1 && res[i].indexOf('level1')==-1;
		isCategoryTitle = res[i].split('<td').length>1 && res[i].split('<td').length<4 && res[i].indexOf('level1')==-1; ;
		isPractic = res[i].split('<td').length>3  && !isCategoryTitle && res[i].indexOf('gradeitemdescriptionfiller')==-1  && res[i].indexOf('level1')==-1;;
		if (isPractic)
		{
			if (lastIsCategoryResult && res[i].indexOf('level3')!=-1) 
				{
					category = lastCategory;
					categoryResultBeforePractics = true;
				}
			title  = res[i].match(/\/>[^<]*</)[0].replace('/>','').replace('<','');
			for (convertFrom in convert)
			{
				if (title.indexOf(convertFrom)!=-1)
				{
					title.replace(convertFrom,convert[convertFrom]);
				}
			}
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
			
			inByzeroo = false;
			for (j=0;j<byzero.length;j++)
			{
				if (title.toLowerCase().indexOf(byzero[j])!=-1)
				{
					inByzeroo=true;
					break;
				}
			}
			if (!inByzeroo)
			{
				category_result+=grade;
				category_max+=max;
			}
			

			grades["categories"][category]["practics"].push({"title":title,"href":href,"grade":grade,"max":max,"weight":weight});
		}
		else if (isCategoryTitle)
		{
			// title  = res[i].match(/\/>[^<]*</)[0].replace('/>','').replace('<','');
			// console.log(i,res[i]);
			grades["categories"][category]["result"]["grade"]+=category_result;
			grades["categories"][category]["result"]["weight"]=category_weight;
			grades["categories"][category]["result"]["max"]+=category_max;
			category_result = 0;
			category_max = 0;
			category = res[i].match(/<\/i>[^<]*</)[0].replace(/<\/i>/,'').replace('<','');
			for (convertFrom in convert)
			{
				if (category.indexOf(convertFrom)!=-1)
				{
					category.replace(convertFrom,convert[convertFrom]);
				}
			}
			grades["categories"][category]={"practics":[],"result":{"grade":0,"max":0,"weight":0,}};
		}
		else if (isCategoryResult)
		{

			category_weight  = res[i].match(/column-range[^>]*>[^<]*</)[0].replace(/column-range[^>]*>/,'').replace('<','').split("&ndash;")[1];
			category_weight = parseFloat(re.exec(category_weight));
			for (j=0;j<frozenmax.length;j++)
			{
				// console.log(category,frozenmax[j])
				if (category.toLowerCase().indexOf(frozenmax[j])!=-1)
				{
					category_max = category_weight;
				}
			}
			// if (category == "Дополнительные баллы") category_max = category_weight;
			// grades[category]["result"]={"grade":category_result,"weight":category_weight,"max":category_max};
			
			grades["categories"][category]["result"]["grade"]+=category_result;
			grades["categories"][category]["result"]["weight"]+=category_weight;
			grades["categories"][category]["result"]["max"]+=category_max;
			// console.log(category_result, category_weight,category_max, grades["result"]["grade"]);
			
			// console.log(category_result, category_weight,category_max, grades["result"]["grade"]);
			lastCategory = category;

			category = "";
			category_result = 0;
			category_max = 0;
		}
	}

	grades["categories"][category]["result"]["grade"]+=category_result;
	grades["categories"][category]["result"]["weight"]=category_weight;
	grades["categories"][category]["result"]["max"]+=category_max;


	grades["result"]["grade"]+=grades["categories"][""]["result"]["grade"];
	for (category in grades["categories"])
	{
		if (category!="")
		{
			category_max    = grades["categories"][category]["result"]["max"];
			category_result = grades["categories"][category]["result"]["grade"];
			category_weight = grades["categories"][category]["result"]["weight"];
			if (category_max!=0) grades["result"]["grade"]+=(category_result - (category_result % category_max)*(category_result/category_max>1)) * category_weight/category_max;
		}
	}
	// grades["result"]["grade"]=85;
	return grades;
}
function drowGrades(table,grades,colors,brs)
{
	categories = grades["categories"];
	for (category in categories)
	{

		if (category=="") continue;
		if (categories[category]["practics"].length==0) continue;
		tr = document.createElement('tr');
		tr.className = "table-grade-category-title table-grade-row";
		tr.style.backgroundColor=colors["category-title"];
		tr.innerHTML=`<td colspan="${Object.keys(categories[category]["practics"][0]).length-1}"><b>${category}</b></td>`;
		table.appendChild(tr);
		practics = categories[category]["practics"];
		for (i=0;i<practics.length;i++)
		{
			title  = practics[i]["title"];
			href   = categories[category]["practics"][i]["href"];
			grade  = practics[i]["grade"];
			max    = practics[i]["max"];
			weight = practics[i]["weight"];
			tr = document.createElement('tr');
			tr.className = "table-grade-practic table-grade-row";
			tr.style.backgroundColor=colors["practic"][i%2];
			tr.innerHTML=`<td><a href = "${href}">${title}</a></td><td>${grade}</td><td>${max}</td><td>${weight}%</td>`;
			table.appendChild(tr);
		}
		title  = `Итого в категории "${category}"`;
		grade  = categories[category]["result"]["grade"];
		max    = categories[category]["result"]["max"];
		weight = categories[category]["result"]["weight"];
		tr = document.createElement('tr');
		tr.className = "table-grade-category-result table-grade-row";
		tr.style.backgroundColor=colors["category-result"];
		tr.innerHTML=`<td><b>${title}</b></td><td>${grade}</td><td>${max}</td><td>${weight}%</td>`;
		table.appendChild(tr);
	}
	if (categories[""]["practics"].length!=0)
	{
		category="";
		for (i=0;i<categories[""]["practics"].length;i++)
		{
			title  = categories[category]["practics"][i]["title"];
			grade  = categories[category]["practics"][i]["grade"];
			max    = categories[category]["practics"][i]["max"];
			weight = categories[category]["practics"][i]["weight"];
			href   = categories[category]["practics"][i]["href"];
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
	var result = grades["result"]["grade"];
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
	tr.innerHTML=`<td><b>Итог</b></td><td style="background-color:${color};" colspan="3">${result.toFixed(2)} ${comment}</td>`;
	table.appendChild(tr);
}