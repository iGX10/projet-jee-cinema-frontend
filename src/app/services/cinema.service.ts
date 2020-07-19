import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host: string = "http://localhost:8080"
  constructor(private http: HttpClient) { }

  public getVilles() {
    return this.http.get(this.host + "/villes")
  }

  getCinemas(ville) {
    return this.http.get(ville._links.cinemas.href)
  }

  getSalles(cinema) {
    return this.http.get(cinema._links.salles.href)
  }

  getSalleProjections(salle) {
    let url:string = salle._links.projections.href.replace("{?projection}", "")
    return this.http.get(url+"?projection=p1")
  }

  getPlaces(projection) {
    let url:string = projection._links.tickets.href.replace("{?projection}", "")
    return this.http.get(url+"?projection=ticketProj")
  }

  payTickets(paymentForm) {
    return this.http.post(this.host+'/payerTickets', paymentForm);
  }
}
