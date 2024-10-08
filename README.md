# augmented-walk

Ce projet a été développé dans le cadre d'un travail de Bachelor. Deux prototypes d'écrans (un écran de boussole et un écran de réalité augmentée) ont été conçus pour une application de balade augmentée.

### Écran de boussole

Le développement de l'écran de boussole a été entièrement réalisé en JavaScript, en utilisant des API Web telles que DeviceOrientation, Geolocation et LocalStorage. Ces technologies permettent de récupérer la géolocalisation de l’utilisateur, l’orientation de son appareil, et de stocker localement les progrès de l’utilisateur afin de l’orienter vers le point d’intérêt suivant. 

Initialement, il n’était pas nécessaire d’utiliser des formes en 3D, c’est pourquoi les éléments visuels ont été créés avec l’objet CanvasRenderingContext2D. L’objectif de cet écran est de prototyper la boussole qui guidera l’utilisateur vers les points d’intérêt.

### Écran de réalité augmentée (RA)

Le développement de l’écran de réalité augmentée a été réalisé à l’aide du framework A-Frame et de la bibliothèque AR.js, ainsi que de l’API de géolocalisation Web. Cet écran a pour objectif de faire apparaître un modèle 3D d’éolienne, trouvé sur Sketchfab, à la position actuelle de l’utilisateur.

Ce projet utilise A-Frame (version 1.4.0) et AR.js (version 3.4.5). Il est important d'utiliser ces deux versions ensemble pour assurer la compatibilité.

### Déploiement

Le projet a été déployé sur Netlify et est accessible à l'adresse suivante : [https://augmented-walk.netlify.app](https://augmented-walk-git.netlify.app/)

## Quickstart

1. Créez un dossier pour votre projet et déplacez-vous dedans.
2. Clonez (ou forkez, ou téléchargez) le dépôt :

   ```bash
   git clone https://github.com/cindymurier/augmented-walk.git
   ```
3. Testez le projet directement via localhost en lançant un serveur local. Par exemple, vous pouvez utiliser l'extension Live Server sur Visual Studio Code.

   **OU**

4. Installez les dépendances nécessaires avec la commande suivante :

   ```bash
   npm install
   ```

5. Lancez le projet en mode développement avec la commande :

   ```bash
   npm run dev

## Notes pour l'écran de boussole

Assurez-vous que le navigateur utilisé pour les tests est compatible avec l'[API DeviceOrientation](https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientationabsolute_event).

## Notes pour l'écran RA

Vérifiez que le navigateur utilisé soit compatible avec l'[API WebXR](https://caniuse.com/webxr).
