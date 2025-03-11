# Application (IA) de Détection de Maladies des Plantes

## Aperçu
Ce projet est une **application de détection de maladies des plantes** qui utilise **Spring Boot** pour le backend, **Angular** pour le frontend, et un **modèle de machine learning** entraîné sur le dataset **PlantVillage** de Kaggle. L'application permet aux utilisateurs de téléverser des images de feuilles de plantes, et elle prédit si la plante est saine ou affectée par une maladie spécifique.

## Fonctionnalités
- **Téléversement d'images** : Les utilisateurs peuvent téléverser des images de feuilles de plantes.
- **Prédiction des maladies** : Le backend traite l'image à l'aide d'un modèle de machine learning pré-entraîné et prédit la maladie.
- **Interface conviviale** : Le frontend offre une interface intuitive pour téléverser des images et afficher les résultats.

## Technologies Utilisées
- **Backend** : Spring Boot
- **Frontend** : Angular
- **Machine Learning** : TensorFlow/Keras (MobileNetV2)
- **Dataset** : PlantVillage de Kaggle

## Structure du Projet
1. **Backend** : Gère le traitement des images et la prédiction des maladies.
2. **Frontend** : Fournit l'interface utilisateur pour téléverser des images et afficher les résultats.
3. **Modèle de Machine Learning** : Un modèle pré-entraîné pour classer les maladies des plantes.

## Guide de Démarrage

### Prérequis
- Java Development Kit (JDK) 11 ou supérieur
- Node.js et Angular CLI
- Python 3.7 ou supérieur (pour l'entraînement du modèle)
- TensorFlow 2.x
- Compte Google Colab ou Kaggle (pour l'entraînement du modèle)

### Étape 1 : Préparer le Dataset et Entraîner le Modèle
1. **Télécharger le Dataset** :
   - Téléchargez le dataset [PlantVillage](https://www.kaggle.com/datasets/emmarex/plantdisease) depuis Kaggle.

2. **Entraîner le Modèle** :
   - J'ai utilisé Google Colab pour entraîner un modèle de deep learning sur le dataset PlantVillage.
   - J'ai sauvegardé le modèle entraîné au format `.h5`.
   - J'ai recupéré le code d'entrainement Ptython sur internet, que j'ai par la suite appliqué sur le dataset

   Exemple de code pour entraîner le modèle :
   ```python
   import tensorflow as tf
   from tensorflow.keras.preprocessing.image import ImageDataGenerator

   # Charger et prétraiter les données
   train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
   train_generator = train_datagen.flow_from_directory(
       '/kaggle/input/plantdisease/PlantVillage',
       target_size=(224, 224),
       batch_size=32,
       class_mode='categorical',
       subset='training'
   )

   # Charger un modèle pré-entraîné
   base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
   base_model.trainable = False

   # Ajouter des couches personnalisées
   model = tf.keras.Sequential([
       base_model,
       tf.keras.layers.GlobalAveragePooling2D(),
       tf.keras.layers.Dense(128, activation='relu'),
       tf.keras.layers.Dense(train_generator.num_classes, activation='softmax')
   ])

   # Compiler le modèle
   model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

   # Entraîner le modèle
   model.fit(train_generator, epochs=10)

   # Sauvegarder le modèle
   model.save('plant_disease_model.h5')
   ```

### Étape 2 : Configurer le Backend avec Spring Boot
1. **Créer un Projet Spring Boot** :
   - Utilisez Spring Initializr pour créer un nouveau projet avec des dépendances comme Spring Web et Spring Boot DevTools.

2. **Intégrer le Modèle TensorFlow** :
   - Utilisez TensorFlow Java pour charger le modèle `.h5` et créer un service pour prédire les maladies à partir des images.

   Exemple de code Spring Boot :
   ```java
   @RestController
   @RequestMapping("/api")
   public class PlantDiseaseController {

       private static final String MODEL_PATH = "path/to/plant_disease_model.h5";

       @PostMapping("/predict")
       public String predictDisease(@RequestParam("file") MultipartFile file) {
           try {
               // Charger le modèle
               byte[] graphDef = Files.readAllBytes(Paths.get(MODEL_PATH));
               Graph graph = new Graph();
               graph.importGraphDef(graphDef);

               // Prétraiter l'image
               BufferedImage img = ImageIO.read(file.getInputStream());
               img = resizeImage(img, 224, 224);
               float[] normalizedImage = normalizeImage(img);

               // Prédire la maladie
               try (Session session = new Session(graph)) {
                   Tensor<?> inputTensor = Tensor.create(normalizedImage);
                   Tensor<?> outputTensor = session.runner()
                       .feed("input_layer_name", inputTensor)
                       .fetch("output_layer_name")
                       .run()
                       .get(0);
                   float[] predictions = new float[outputTensor.shape()[1]];
                   outputTensor.copyTo(predictions);
                   return getDiseaseLabel(predictions);
               }
           } catch (Exception e) {
               e.printStackTrace();
               return "Erreur lors du traitement de l'image";
           }
       }
   }
   ```

### Étape 3 : Configurer le Frontend avec Angular
1. **Créer un Projet Angular** :
   - Utilisez Angular CLI pour créer un nouveau projet : `ng new plant-disease-app`.

2. **Créer un Formulaire de Téléversement d'Image** :
   - Utilisez Angular Material pour créer une interface utilisateur conviviale pour téléverser des images.

   Exemple de code Angular :
   ```html
   <div>
     <h1>Détection de Maladies des Plantes</h1>
     <input type="file" (change)="onFileSelected($event)" />
     <button (click)="onUpload()">Analyser</button>
     <div *ngIf="prediction">
       <h2>Résultat : {{ prediction }}</h2>
     </div>
   </div>
   ```

   ```typescript
   export class AppComponent {
     selectedFile: File | null = null;
     prediction: string | null = null;

     constructor(private http: HttpClient) {}

     onFileSelected(event: any) {
       this.selectedFile = event.target.files[0];
     }

     onUpload() {
       if (this.selectedFile) {
         const formData = new FormData();
         formData.append('file', this.selectedFile);

         this.http.post('/api/predict', formData, { responseType: 'text' })
           .subscribe((response) => {
             this.prediction = response;
           });
       }
     }
   }
   ```

### Étape 4 : Tester et Déployer l'Application
- **Tester Localement** : Exécutez le backend Spring Boot et le frontend Angular localement pour vérifier que tout fonctionne.
- **Déployer** : Déployez l'application sur une plateforme cloud comme AWS, Heroku, ou utilisez Docker pour la conteneurisation.

## Résultat
Vous aurez une application fonctionnelle où :
1. Les utilisateurs peuvent téléverser des images de feuilles de plantes.
2. Le backend prédit la maladie en utilisant le modèle entraîné.
3. Le frontend affiche le résultat de la prédiction.

## Conclusion
Ce projet montre comment construire une application complète de détection de maladies des plantes en utilisant des technologies modernes. Il combine le machine learning, le développement backend et le développement frontend pour créer un outil utile pour identifier les maladies des plantes.

N'hésitez pas à contribuer, à ouvrir des issues ou à suggérer des améliorations ! 🌿

---

**Remarque** : Remplacez les placeholders comme `path/to/plant_disease_model.h5` par les chemins réels et ajustez le code selon votre configuration spécifique.

Bon codage ! 🚀
