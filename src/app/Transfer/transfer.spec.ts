import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Transfer } from './transfer';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Transfer', () => {

  let component: Transfer;
  let fixture: ComponentFixture<Transfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Transfer],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Transfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
