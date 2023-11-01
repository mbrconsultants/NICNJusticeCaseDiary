const events = [
    
     {  index:1,
        title: 'Theft between A and B',
        casetype:'2',
        start: '2023-04-20',
        eventType: "type3",
        caseCategory:1
      },
      {  index:1,
        title: 'Land Despute between mr A and Mrs B',
        casetype:'3',
        start: '2023-04-20',
        eventType: "type1",
        caseCategory:2
      },
      {  index:1,
        title: 'Land Despute between mr A and Mrs B',
        casetype:'3',
        start: '2023-04-07',
        eventType: "type1",
        caseCategory:1
      },
     
      {  index:1,
        title: 'Child Abuse',
        casetype:'1',
        start: '2023-04-20',
        eventType: "type2",
        caseCategory:2
      },
      {  index:1,
        title: 'Car theft',
        casetype:'2',
        start: '2023-04-25',
        eventType: "type1",
        caseCategory:1
      },
      {  index:1,
        title: 'Child Abuse',
        casetype:'1',
        start: '2023-04-25',
        eventType: "type2",
        caseCategory:2
      },
      {
        index:1,
        title: 'Vanderlisation',
        casetype:'1',
        start: '2023-05-01',
        eventType: "type3",
        caseCategory:1
      }

  ];
  
  function getDate(dayString) {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();
  
    if (month.length === 1) {
      month = "0" + month;
    }
  
    return dayString.replace("YEAR", year).replace("MONTH", month);
  }
  
  export default events;
  