import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use((StealthPlugin()))
import {getData} from './functions/podio'
import { Info,Credentials,firstBatch,secondBatch,thirdBatch,fourthBatch,FifthBatch } from './functions/helper'
import mysql2 from 'mysql2/promise'

const Start = () =>{
    (async()=>{
        var profileData = [];
        /*
        const data = await getData();
        const profileFromPodio = await OrganizeData(data);
        console.log(profileFromPodio);  
        */
       
        var countLinked = 1
        for(var i in FifthBatch .reverse()){ //put .reverse() to reverse the array

            const con = await mysql2.createConnection({
                host:'localhost',
                user: "root", 
                password: "",
                database: "podiodb"
            })

            var checkdup = await con.execute("SELECT * FROM linkedIn_profiles WHERE item_id = "+"'"+`${FifthBatch [i]}`+"'")
            console.log("length sql result =>",checkdup[0].length);
           
            if(checkdup[0].length === 0){
            
                var browser = await puppeteer.launch({
                    executablePath : 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                    args:[
                        '--user-data-dir=C:/Users/Remote 5 User 1A/AppData/Local/Google/Chrome/User Data'
                    ],
                    userDataDir: 'C:/Users/Remote 5 User 1A/AppData/Local/Google/Chrome/User Data',
                    headless: false,
                    slowMo: 600
                })
                var page = await browser.newPage();
                let newpage = await page.goto(FifthBatch [i],{
                    waitUntil: 'networkidle2',
                })
                var X = 1;
                while(X <= 7){
                    page.evaluate(_ => {
                        window.scrollBy(0, window.innerHeight);
                    });
                    console.log("Loop")
                    await Delay()
                    X++;
                } 
                try{
                    await page.evaluate(()=>{
                        return  document.querySelectorAll('.pv-profile-section__card-action-bar.pv-skills-section__additional-skills.artdeco-container-card-action-bar.artdeco-button.artdeco-button--tertiary.artdeco-button--3.artdeco-button--fluid')[0].click();
                    })
                }catch{
                    console.log("No View more button detected");
                }
                try{
                    await page.evaluate(()=>{
                        return  document.querySelectorAll('.pv-profile-section__see-more-inline.pv-profile-section__text-truncate-toggle.link-without-visited-state')[0].click();
                    })
                }catch{
                    console.log("No View more button detected");
                }
                try {
                    var name = await page.evaluate(()=>{
                        return document.querySelectorAll('div.ph5.pb5 > div.display-flex.mt2 > div.flex-1.mr5 > ul.pv-top-card--list.inline-flex.align-items-center > li.inline.t-24.t-black.t-normal.break-words')[0].innerText;
                    })
                } catch (error) {
                    console.log("No name detected");
                }
                try { 
                    var job_title = await page.evaluate( () =>{
                        return document.querySelectorAll('div.ph5.pb5 > div.display-flex.mt2 > div.flex-1.mr5 > h2')[0].innerText;
                    })
                } catch (error) {
                    console.log("No job_title detected");
                }
                try { 
                    var about = await page.evaluate( () =>{
                        return document.querySelectorAll('.pv-about__summary-text.mt4.t-14.ember-view')[0].innerText;
                    })
                } catch (error) {
                    console.log("No about detected");
                }
                try { 
                    var current_employer = await page.evaluate( () =>{
                        return document.querySelectorAll('div.pv-entity__summary-info.pv-entity__summary-info--background-section.mb2')[0].innerText;
                    }) 
                } catch (error) {
                    console.log("No current_employer detected");
                }
                try { 
                    var experience = await page.evaluate( () =>{
                        return document.querySelectorAll('#experience-section')[0].innerText;
                    })
                } catch (error) {
                    console.log("No experience detected");
                }
                try { 
                    var education = await page.evaluate( () =>{
                        return document.querySelectorAll('#education-section')[0].innerText;
                    })
                } catch (error) {
                    console.log("No education detected");
                }
                try { 
                    var skills = await page.evaluate( () =>{
                        return document.querySelectorAll('.pv-skill-categories-section__top-skills.pv-profile-section__section-info.section-info.pb1')[0].innerText;
                    })
                } catch (error) {
                    console.log("No skills detected");
                }
                try { 
                    var recommendation = await page.evaluate(()=>{
                        return document.querySelectorAll('.artdeco-tabpanel.active.ember-view')[0].innerText;
                    })
                } catch (error) {
                    console.log("No recommendation detected");
                }
                profileData.push({
                    "item_id":FifthBatch [i],
                    "Name":name,
                    "JobTitle":job_title,
                    "About":about,
                    "current_employer":current_employer,
                    "Experience":experience,
                    "Education":education,
                    "Skills":skills,
                    "Recommendation":recommendation,
                });
                console.log(profileData)
                await page.close(); 
                await browser.close();
                console.log("THE ID CHECK HERE",FifthBatch [i])
                console.log("Inserting Data");
                await Delay()
                    var DataInsert = [[
                        FifthBatch [i],
                        name,
                        job_title,
                        about,
                        current_employer,
                        experience,
                        education,
                        skills,
                        recommendation,
                        FifthBatch[i]
                    ]]
                    
                    var scripteInsert = "INSERT INTO linkedIn_profiles(item_id, name, job_title, about, current_employeer, experience,education,skills,recommendation,link) VALUES ? ";
                    let inserted = await con.query(scripteInsert,[DataInsert])
                    console.log("Insert Result =>",inserted);
                }
                
                console.log("clearing array for new entry");
                name = "";
                job_title = "";
                about = "";
                current_employer = "";
                experience = "";
                education = "";
                skills = "";
                recommendation = "";
                console.log("Counts of batch =>", FifthBatch.length);
                await Delay()
                countLinked +=1
                console.log(countLinked);
                con.end();
        }
        console.log("Done Scrapping")
    })();
}

const Delay = () => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("go");
        },3000)
    })
}

const OrganizeData = (data) =>{
    return new Promise((resolve,reject)=>{
        for(var i  in data.items){
            Info.Item_Id = data.items[i].item_id;
            console.log(Info.Item_Id);
           for(var x in data.items[i].fields){
                switch(data.items[i].fields[x].label){
                    case 'Name':
                        Info.Name = data.items[i].fields[x].values[0].value
                    break;
                    case 'Email Name(1st name or nickname)':
                        Info.Email_Name = data.items[i].fields[x].values[0].value
                    break;
                    case 'Status':
                        Info.Status = data.items[i].fields[x].values[0].value.text
                    break;
                    case 'Current Employer':
                        Info.Current_Employer = data.items[i].fields[x].values[0].value.title
                    break;
                    case 'Job Title':
                        Info.Job_Title = data.items[i].fields[x].values[0].value
                    break;
                    case 'Email':
                        Info.Email = data.items[i].fields[x].values[0].value
                    break;
                    case 'Phone':
                        Info.Phone = data.items[i].fields[x].values[0].value
                    break;
                    case 'LinkedIn Profile Link':
                        Info.LinkedIn_Profile = data.items[i].fields[x].values[0].embed.original_url
                    break;
                    case 'Connection Status':
                        Info.Connection_Status = data.items[i].fields[x].values[0].value.text
                    break;
                    case 'Outlook Connection Status':
                        Info.Outlook_Connection_Status = data.items[i].fields[x].values[0].value.text
                    break;
                }
           }
            Info.All.push({
            Item_Id: Info.Item_Id,
            Name: Info.Name,
            Email_Name: Info.Email_Name,
            Status: Info.Status,
            Current_Employer: Info.Current_Employer,
            Job_Title: Info.Job_Title,
            Email: Info.Email,
            Phone: Info.Phone,
            LinkedIn_Profile : Info.LinkedIn_Profile,
            Connection_Status : Info.Connection_Status,
            Outlook_Connection_Status: Info.Outlook_Connection_Status,
            });
            Info.Item_Id = "";
            Info.Name="";
            Info.Email_Name="";
            Info.Status="";
            Info.Current_Employer="";
            Info.Job_Title="";
            Info.Email="";
            Info.Phone="";
            Info.LinkedIn_Profile="";
            Info.Connection_Status="";
            Info.Outlook_Connection_Status="";
        }
        resolve(Info.All)
    })
}
Start();