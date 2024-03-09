import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {provideRouter, RouterOutlet} from "@angular/router";
import {MapComponent} from "./components/map/map.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {
  EcoFabSpeedDialActionsComponent,
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent
} from "@ecodev/fab-speed-dial";
import {PlantsGatewayService} from "./gateway/plants-gateway.service";
import {PlantSpeciesGatewayService} from "./gateway/plant-species-gateway.service";
import {MapService} from "./services/map.service";
import {PlantAddComponent} from "./components/plant-add/plant-add.component";
import {PlantInfoComponent} from "./components/plant-info/plant-info.component";
import {PlantListComponent} from "./components/plant-list/plant-list.component";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, JsonPipe, NgFor, NgIf} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MapComponent,
    PlantAddComponent,
    PlantInfoComponent,
    PlantListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgFor,
    JsonPipe,
    ClipboardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    EcoFabSpeedDialActionsComponent,
  ],
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),

    PlantsGatewayService,
    PlantSpeciesGatewayService,
    MapService,
    RouterOutlet,
  ]
})
export class AppModule {
}
