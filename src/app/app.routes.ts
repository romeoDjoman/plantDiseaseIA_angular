import { Routes } from '@angular/router';
import { PredictDiseaseComponent } from './features/predict-disease/predict-disease.component';

export const routes: Routes = [
    { path: 'predict', component: PredictDiseaseComponent },
    { path: '', redirectTo: '/predict', pathMatch: 'full' }
];
