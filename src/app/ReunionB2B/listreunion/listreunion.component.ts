import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {ReunionService} from "../../Services/R&C B2B/ReunionB2B/reunion.service";
import {HttpClient} from "@angular/common/http";

let meetWindow: Window | null;

@Component({
  selector: 'app-listreunion',
  templateUrl: './listreunion.component.html',
  styleUrls: ['./listreunion.component.css']
})
export class ListreunionComponent implements OnInit {
  itemsPerPage = 10;
  currentPage = 1;
  username: any;
  table: any;
  isApproved: boolean = false;

  public searchTerm: string = '';
  meetLink: string = '';

  status: any;

  constructor(private aRoute:ActivatedRoute,
              private route:Router, private reunionService:ReunionService,
              private datePipe: DatePipe,private http: HttpClient) { }

  ngOnInit(): void {
    //this.username=this.aRoute.snapshot.params['username']
    if (this.username==="admin"){
      this.reunionService.ReunionList(1).subscribe((data) => { console.log(data)
        // Parcourir la liste des devoirs et formater les dates de début et de fin
        this.table = data.map((reunion) => ({
          ...reunion,
          dateTime: this.datePipe.transform(
            reunion.dateTime,
            'yyyy-MM-dd hh-mm'
          ),
        }));
      });
    }
    else{
      // this.nom = this.route.snapshot.paramMap.get('nom');
      //this.dutyService.Dutylist().subscribe(k =>{this.table=k});
      this.reunionService.ReunionList(1).subscribe((data) => { console.log(data)
        // Parcourir la liste des devoirs et formater les dates de début et de fin
        this.table = data.map((reunion) => ({
          ...reunion,
          dateTime: this.datePipe.transform(
            reunion.dateTime,
            'yyyy-MM-dd hh-mm'
          ),
        }));
      });
    }
    window.addEventListener('message', this.handleMessage.bind(this));
  }
  handleMessage(event: MessageEvent) {
    // Vérifie que le message provient de la fenêtre fille
    if (event.source === meetWindow && event.data && event.data.meetLink) {
      // Récupère et traite le lien Meet
      const meetLink = event.data.meetLink;
      this.recupererLienMeet(meetLink);
    }
  }
// app.component.ts
// ...

  // app.component.ts
// ...

  genererLien() {
    // Ouvre une nouvelle fenêtre pour la page Google Meet
    meetWindow = window.open('https://meet.google.com/new?hs', '_blank');

    // Attend 4 secondes (4000 millisecondes)
    setTimeout(() => {
      // Récupère le lien de la fenêtre fille
      const meetLink = 'https://meet.google.com/exemple';  // Remplace 'exemple' par le vrai lien Meet

      // Envoie le lien à la fenêtre parente (ta page Angular)
      window.postMessage({ meetLink }, '*');
    }, 4000);
  }

  // Fonction pour récupérer le lien Meet
  recupererLienMeet(meetLink: string) {
    if (meetLink.indexOf('https://meet.google.com/') !== -1) {
      this.meetLink = meetLink;
    } else {
      console.error('Le lien Meet n\'a pas été trouvé dans la barre d\'adresse.');
    }
  }


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


// ...


  afficherLien() {
    // Affiche le lien dans la console (à adapter selon tes besoins)
    console.log('Lien Meet récupéré :', this.meetLink);
  }

// ...



  addev(){
    Swal.fire({
      title: 'Are you sure want to Delete this Event?',
      text: 'You will not be able to recover this Event!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor:'blue',
    }).then(async (result) => {
      if (result.value) {
        this.route.navigate(['addreunion'])

        //delete Event confirmation
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.route.navigate(['AddHoliday/'+this.username])

      }
    })
  }

}