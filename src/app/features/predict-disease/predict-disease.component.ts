import { Component } from '@angular/core';
import { PlantDiseaseService } from '../../service/plant-disease.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-predict-disease',
  imports: [
    CommonModule
  ],
  templateUrl: './predict-disease.component.html',
  styleUrl: './predict-disease.component.css'
})
export class PredictDiseaseComponent {
  selectedFile: File | null = null;
  prediction: string | null = null;

  constructor(private plantDiseaseService: PlantDiseaseService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      this.plantDiseaseService.predictDisease(this.selectedFile).subscribe(
        (response) => {
          this.prediction = response; // Affiche la prédiction
        },
        (error) => {
          console.error('Erreur lors de la prédiction :', error);
          this.prediction = 'Erreur lors de la prédiction';
        }
      );
    }
  }

}
