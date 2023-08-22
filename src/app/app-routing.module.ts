import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomataComponent } from './components/automata/automata.component';

const routes: Routes = [
{path: '', component: AutomataComponent},
{path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  


}
