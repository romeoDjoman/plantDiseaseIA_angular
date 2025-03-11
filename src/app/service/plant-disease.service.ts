import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantDiseaseService {

  private apiUrl = 'http://localhost:8080/api/predict';

  constructor(private http: HttpClient) { }

  predictDisease(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file); // Ajoute le fichier au FormData
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }
}
