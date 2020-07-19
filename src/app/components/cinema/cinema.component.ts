import { Component, OnInit } from '@angular/core';
import {CinemaService} from '../../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public currentVille;
  public currentCinema;
  public salles;
  public currentProjection;
  public selectedTickets: any[] = [];

  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(resp => {
        this.villes = resp;
      },error => {
        console.log(error);
      })
  }

  onClickGetCinemas(ville) {
    this.currentVille =ville;
    this.salles = undefined;

    this.cinemaService.getCinemas(ville)
      .subscribe(resp => {
        this.cinemas = resp;
      },error => {
        console.log(error);
      })
  }

  onClickGetSalles(cinema) {
    this.currentCinema = cinema;

    this.cinemaService.getSalles(cinema)
      .subscribe(resp => {
        this.salles = resp;

        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getSalleProjections(salle)
            .subscribe(resp => {
              salle.projections = resp;
            }, error => {
              console.log(error);
            })
        })
      }, error => {
        console.log(error);
      })
  }

  onClickGetTicketsPlaces(projection) {
    this.currentProjection = projection;
    this.cinemaService.getPlaces(projection)
      .subscribe(resp => {
        this.currentProjection.tickets = resp;
        console.log(this.currentProjection.tickets);
        this.selectedTickets = [];
      }, error => {
        console.log(error);
      })
  }

  onSelectTicket(ticket: any) {
    if(!ticket.selected) {
      ticket.selected = true;
      this.selectedTickets.push(ticket);
    }
    else {
      ticket.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket), 1);
    }
  }

  getTicketClass(ticket: any) {
    let str = 'btn ticket ';
    if(ticket.selected==true) {
      str += 'btn-warning';
    }
    else {
      str += 'btn-success';
    }
    return str;
  }

  onPayTickets(paymentForm) {
    paymentForm.tickets = [];
    this.selectedTickets.forEach(ticket => {
      paymentForm.tickets.push(ticket.id);
    });

    this.cinemaService.payTickets(paymentForm)
      .subscribe(resp => {
        alert("Paiement avec succès");
        this.onClickGetTicketsPlaces(this.currentProjection);
      }, error => {
        console.log(error);
      })
  }
}
