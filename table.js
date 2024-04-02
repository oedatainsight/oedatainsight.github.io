
// Assuming the data is in a format similar to this:
var supplementsData = [
  {
    "supplements": [
      {
        "name": "Goldenseal",
        "compounds": [
          {
            "name": "Isoquinoline alkaloids",
            "content": "10.8 ± 0.15",
            "dailyDose": 64.8,
            "dosageForm": "Hard gelatin capsule",
            "disintegrationTime": "20.4 ± 1.7"
          },
          {
            "name": "Hydrastine",
            "content": "12.9 ± 0.15",
            "dailyDose": 77.4
          },
          {
            "name": "Berberine",
            "content": "23.7",
            "dailyDose": 142.2
          },
          {
            "name": "Total",
            "content": "23.7",
            "dailyDose": 142.2
          }
        ]
      },
      {
        "name": "Black cohosh",
        "compounds": [
          {
            "name": "Triterpene glycosides",
            "content": "0.2 ± 0.02",
            "dailyDose": 0.8,
            "dosageForm": "Hard gelatin capsule",
            "disintegrationTime": "4.9 ± 0.1"
          },
          {
            "name": "Cimiracemoside",
            "content": "0.6 ± 0.01",
            "dailyDose": 2.4
          },
          {
            "name": "27-deoxyactein",
            "content": "1.9 ± 0.06",
            "dailyDose": 7.6
          },
          {
            "name": "Actein",
            "content": "Total",
            "dailyDose": 10.8
          }
        ]
      },
      {
        "name": "Kava kava",
        "compounds": [
          {
            "name": "Kava pyrone lactones",
            "content": "8.4 ± 0.86",
            "dailyDose": 33.6,
            "dosageForm": "Hard gelatin capsule",
            "disintegrationTime": "14.2 ± 2.6"
          },
          {
            "name": "Kavain",
            "content": "7.9 ± 0.81",
            "dailyDose": 31.6
          },
          {
            "name": "Dihydrokavain",
            "content": "6.3 ± 0.66",
            "dailyDose": 25.2
          },
          {
            "name": "Methysticin",
            "content": "4.5 ± 0.45",
            "dailyDose": 18.0
          },
          {
            "name": "Dihydromethysticin",
            "content": "3.6 ± 0.36",
            "dailyDose": 14.4
          },
          {
            "name": "Yangonin",
            "content": "3.8 ± 0.40",
            "dailyDose": 15.2
          },
          {
            "name": "Desmethoxyyangonin",
            "content": "Total",
            "dailyDose": 138
          }
        ]
      },
      {
        "name": "Valerian",
        "compounds": [
          {
            "name": "Valerenic acid",
            "content": "Trace",
            "dailyDose": "trace",
            "dosageForm": "Uncoated tablet",
            "disintegrationTime": "42.1 ± 10.8"
          }
        ]
      }
    ]
  }
  
 
];

function insertDataToTable(data) {
  var table = document.getElementById('supplementsTable');
  
  data.forEach(function(supp) {
    supp.compounds.forEach(function(compound, index) {
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      
      cell1.innerHTML = (index === 0) ? supp.supplement : '';
      cell2.innerHTML = compound.name;
      cell3.innerHTML = compound.content;
      cell4.innerHTML = compound.dailyDose;
      cell5.innerHTML = (index === 0) ? supp.compounds[0].dosageForm : '';
      cell6.innerHTML = (index === 0) ? supp.compounds[0].disintegrationTime : '';
    });
  });
}
