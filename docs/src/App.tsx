import React, { useState, useEffect, useRef } from 'react';
import { 
  Pill, User, Stethoscope, ChevronRight, Moon, Sun, Globe, 
  MessageSquare, Clock, Calculator, Beaker, Shield, BookOpen, 
  AlertTriangle, CheckCircle, XCircle, Search, Plus, Trash2, 
  Send, ArrowLeft, Users, Activity, 
  MoreHorizontal, Heart, Droplets, Flame, 
  Bandage, Zap, Wind, ClipboardList, FileText, Syringe, Thermometer,
  FlaskConical, Scale, TrendingUp, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import './App.css';

// Types
type UserRole = 'patient' | 'pharmacist' | null;
type Screen = 'landing' | 'role-selection' | 'patient-profile' | 'dashboard' | 'chat' | 'drug-database' | 'interaction-checker' | 'dose-calculator' | 'timer' | 'converter' | 'admin-guide' | 'hazardous' | 'my-medications' | 'minor-ailments' | 'compounding' | 'tdm' | 'clinical-calculators';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastMessage: string;
  unread: number;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  sender: 'patient' | 'pharmacist';
  text: string;
  timestamp: Date;
  patientId?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
}

interface Drug {
  id: string;
  name: string;
  genericName: string;
  innName: string;
  category: string;
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  pregnancyCategory: string;
}

// Mock Data
const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Ahmed Hassan', age: 45, lastMessage: 'Can I take this with food?', unread: 2, status: 'online' },
  { id: '2', name: 'Sarah Johnson', age: 32, lastMessage: 'Thank you for the advice', unread: 0, status: 'offline' },
  { id: '3', name: 'Mohamed Ali', age: 58, lastMessage: 'I have a question about my prescription', unread: 1, status: 'online' },
  { id: '4', name: 'Fatima Omar', age: 28, lastMessage: 'When should I take the next dose?', unread: 0, status: 'offline' },
  { id: '5', name: 'John Smith', age: 67, lastMessage: 'Is this safe with my blood pressure meds?', unread: 3, status: 'online' },
];

const DRUG_DATABASE: Drug[] = [
  // === ANALGESICS ===
  { id: '1', name: 'Tylenol', genericName: 'Acetaminophen', innName: 'Paracetamol', category: 'Analgesics', dosage: '500-1000mg every 4-6 hours', sideEffects: ['Nausea', 'Stomach upset'], contraindications: ['Liver disease'], pregnancyCategory: 'B' },
  { id: '2', name: 'Advil', genericName: 'Ibuprofen', innName: 'Ibuprofen', category: 'Analgesics', dosage: '200-400mg every 4-6 hours', sideEffects: ['Stomach pain', 'Heartburn'], contraindications: ['Ulcers', 'Kidney disease'], pregnancyCategory: 'C' },
  { id: '3', name: 'Motrin', genericName: 'Ibuprofen', innName: 'Ibuprofen', category: 'Analgesics', dosage: '200-400mg every 4-6 hours', sideEffects: ['Stomach pain', 'Heartburn'], contraindications: ['Ulcers', 'Kidney disease'], pregnancyCategory: 'C' },
  { id: '4', name: 'Aleve', genericName: 'Naproxen', innName: 'Naproxen', category: 'Analgesics', dosage: '220-500mg every 12 hours', sideEffects: ['Stomach upset', 'Dizziness'], contraindications: ['Ulcers', 'Kidney disease'], pregnancyCategory: 'C' },
  { id: '5', name: 'Aspirin', genericName: 'Acetylsalicylic acid', innName: 'Acetylsalicylic acid', category: 'Analgesics', dosage: '81-325mg daily', sideEffects: ['Stomach bleeding', 'Bruising'], contraindications: ['Bleeding disorders', 'Children with viral illness'], pregnancyCategory: 'D' },
  { id: '6', name: 'Tramadol', genericName: 'Tramadol', innName: 'Tramadol', category: 'Analgesics', dosage: '50-100mg every 4-6 hours', sideEffects: ['Drowsiness', 'Nausea', 'Constipation'], contraindications: ['MAO inhibitors', 'Respiratory depression'], pregnancyCategory: 'C' },
  { id: '7', name: 'Morphine', genericName: 'Morphine', innName: 'Morphine', category: 'Analgesics', dosage: '10-30mg every 4 hours', sideEffects: ['Sedation', 'Respiratory depression', 'Constipation'], contraindications: ['Respiratory depression', 'Increased ICP'], pregnancyCategory: 'C' },
  { id: '8', name: 'Oxycodone', genericName: 'Oxycodone', innName: 'Oxycodone', category: 'Analgesics', dosage: '5-15mg every 4-6 hours', sideEffects: ['Sedation', 'Nausea', 'Constipation'], contraindications: ['Respiratory depression', 'Paralytic ileus'], pregnancyCategory: 'B' },
  { id: '9', name: 'Codeine', genericName: 'Codeine', innName: 'Codeine', category: 'Analgesics', dosage: '15-60mg every 4-6 hours', sideEffects: ['Drowsiness', 'Constipation', 'Nausea'], contraindications: ['Respiratory depression', 'Children post-tonsillectomy'], pregnancyCategory: 'C' },
  
  // === STATINS ===
  { id: '10', name: 'Lipitor', genericName: 'Atorvastatin', innName: 'Atorvastatin', category: 'Cardiovascular', dosage: '10-80mg once daily', sideEffects: ['Muscle pain', 'Liver issues'], contraindications: ['Liver disease', 'Pregnancy'], pregnancyCategory: 'X' },
  { id: '11', name: 'Zocor', genericName: 'Simvastatin', innName: 'Simvastatin', category: 'Cardiovascular', dosage: '5-40mg once daily', sideEffects: ['Muscle pain', 'Weakness'], contraindications: ['Liver disease', 'Pregnancy'], pregnancyCategory: 'X' },
  { id: '12', name: 'Crestor', genericName: 'Rosuvastatin', innName: 'Rosuvastatin', category: 'Cardiovascular', dosage: '5-40mg once daily', sideEffects: ['Muscle pain', 'Headache'], contraindications: ['Liver disease', 'Pregnancy'], pregnancyCategory: 'X' },
  { id: '13', name: 'Pravachol', genericName: 'Pravastatin', innName: 'Pravastatin', category: 'Cardiovascular', dosage: '10-80mg once daily', sideEffects: ['Muscle pain', 'Nausea'], contraindications: ['Liver disease', 'Pregnancy'], pregnancyCategory: 'X' },
  
  // === ACE INHIBITORS ===
  { id: '14', name: 'Zestril', genericName: 'Lisinopril', innName: 'Lisinopril', category: 'Cardiovascular', dosage: '5-40mg once daily', sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'], contraindications: ['Angioedema history', 'Pregnancy'], pregnancyCategory: 'D' },
  { id: '15', name: 'Vasotec', genericName: 'Enalapril', innName: 'Enalapril', category: 'Cardiovascular', dosage: '5-40mg daily', sideEffects: ['Dry cough', 'Dizziness'], contraindications: ['Angioedema history', 'Pregnancy'], pregnancyCategory: 'D' },
  { id: '16', name: 'Altace', genericName: 'Ramipril', innName: 'Ramipril', category: 'Cardiovascular', dosage: '2.5-20mg daily', sideEffects: ['Dry cough', 'Dizziness'], contraindications: ['Angioedema history', 'Pregnancy'], pregnancyCategory: 'D' },
  
  // === ARBs ===
  { id: '17', name: 'Cozaar', genericName: 'Losartan', innName: 'Losartan', category: 'Cardiovascular', dosage: '25-100mg daily', sideEffects: ['Dizziness', 'Hyperkalemia'], contraindications: ['Pregnancy'], pregnancyCategory: 'D' },
  { id: '18', name: 'Diovan', genericName: 'Valsartan', innName: 'Valsartan', category: 'Cardiovascular', dosage: '80-320mg daily', sideEffects: ['Dizziness', 'Fatigue'], contraindications: ['Pregnancy'], pregnancyCategory: 'D' },
  
  // === CALCIUM CHANNEL BLOCKERS ===
  { id: '19', name: 'Norvasc', genericName: 'Amlodipine', innName: 'Amlodipine', category: 'Cardiovascular', dosage: '2.5-10mg once daily', sideEffects: ['Edema', 'Dizziness', 'Flushing'], contraindications: ['Severe aortic stenosis'], pregnancyCategory: 'C' },
  { id: '20', name: 'Calan', genericName: 'Verapamil', innName: 'Verapamil', category: 'Cardiovascular', dosage: '120-480mg daily', sideEffects: ['Constipation', 'Dizziness', 'Bradycardia'], contraindications: ['Heart failure', 'AV block'], pregnancyCategory: 'C' },
  { id: '21', name: 'Cardizem', genericName: 'Diltiazem', innName: 'Diltiazem', category: 'Cardiovascular', dosage: '120-480mg daily', sideEffects: ['Edema', 'Dizziness', 'Bradycardia'], contraindications: ['Heart failure', 'AV block'], pregnancyCategory: 'C' },
  
  // === DIURETICS ===
  { id: '22', name: 'Lasix', genericName: 'Furosemide', innName: 'Furosemide', category: 'Cardiovascular', dosage: '20-80mg daily', sideEffects: ['Dehydration', 'Hypokalemia', 'Dizziness'], contraindications: ['Anuria', 'Severe electrolyte depletion'], pregnancyCategory: 'C' },
  { id: '23', name: 'HydroDIURIL', genericName: 'Hydrochlorothiazide', innName: 'Hydrochlorothiazide', category: 'Cardiovascular', dosage: '12.5-50mg daily', sideEffects: ['Hypokalemia', 'Dehydration', 'Dizziness'], contraindications: ['Anuria', 'Sulfonamide allergy'], pregnancyCategory: 'B' },
  { id: '24', name: 'Aldactone', genericName: 'Spironolactone', innName: 'Spironolactone', category: 'Cardiovascular', dosage: '25-200mg daily', sideEffects: ['Hyperkalemia', 'Gynecomastia', 'Dizziness'], contraindications: ['Hyperkalemia', 'Addison disease'], pregnancyCategory: 'C' },
  
  // === ANTIARRHYTHMICS ===
  { id: '25', name: 'Cordarone', genericName: 'Amiodarone', innName: 'Amiodarone', category: 'Cardiovascular', dosage: '200-400mg daily', sideEffects: ['Thyroid issues', 'Lung toxicity', 'Liver issues', 'QT prolongation'], contraindications: ['Severe sinus node dysfunction', 'Bradycardia'], pregnancyCategory: 'D' },
  { id: '26', name: 'Digoxin', genericName: 'Digoxin', innName: 'Digoxin', category: 'Cardiovascular', dosage: '0.125-0.25mg daily', sideEffects: ['Nausea', 'Arrhythmias', 'Visual changes'], contraindications: ['Ventricular fibrillation', 'Digitalis toxicity'], pregnancyCategory: 'C' },
  { id: '27', name: 'Betapace', genericName: 'Sotalol', innName: 'Sotalol', category: 'Cardiovascular', dosage: '80-320mg daily', sideEffects: ['Bradycardia', 'Fatigue', 'QT prolongation'], contraindications: ['Asthma', 'Bradycardia', 'QT prolongation'], pregnancyCategory: 'B' },
  
  // === ANTICOAGULANTS ===
  { id: '28', name: 'Coumadin', genericName: 'Warfarin', innName: 'Warfarin', category: 'Anticoagulants', dosage: '2-10mg daily (individualized)', sideEffects: ['Bleeding', 'Bruising'], contraindications: ['Pregnancy', 'Active bleeding', 'Recent surgery'], pregnancyCategory: 'X' },
  { id: '29', name: 'Eliquis', genericName: 'Apixaban', innName: 'Apixaban', category: 'Anticoagulants', dosage: '2.5-5mg twice daily', sideEffects: ['Bleeding', 'Bruising'], contraindications: ['Active bleeding'], pregnancyCategory: 'B' },
  { id: '30', name: 'Xarelto', genericName: 'Rivaroxaban', innName: 'Rivaroxaban', category: 'Anticoagulants', dosage: '10-20mg daily', sideEffects: ['Bleeding', 'Bruising'], contraindications: ['Active bleeding'], pregnancyCategory: 'C' },
  { id: '31', name: 'Pradaxa', genericName: 'Dabigatran', innName: 'Dabigatran', category: 'Anticoagulants', dosage: '75-150mg twice daily', sideEffects: ['Bleeding', 'Dyspepsia'], contraindications: ['Active bleeding'], pregnancyCategory: 'C' },
  
  // === ANTIBIOTICS ===
  { id: '32', name: 'Amoxil', genericName: 'Amoxicillin', innName: 'Amoxicillin', category: 'Antibiotics', dosage: '250-500mg every 8 hours', sideEffects: ['Diarrhea', 'Rash'], contraindications: ['Penicillin allergy'], pregnancyCategory: 'B' },
  { id: '33', name: 'Zithromax', genericName: 'Azithromycin', innName: 'Azithromycin', category: 'Antibiotics', dosage: '250-500mg daily', sideEffects: ['Diarrhea', 'Nausea', 'QT prolongation'], contraindications: ['Macrolide allergy'], pregnancyCategory: 'B' },
  { id: '34', name: 'Biaxin', genericName: 'Clarithromycin', innName: 'Clarithromycin', category: 'Antibiotics', dosage: '250-500mg every 12 hours', sideEffects: ['Diarrhea', 'Taste changes', 'QT prolongation'], contraindications: ['Macrolide allergy'], pregnancyCategory: 'C' },
  { id: '35', name: 'Ery-Tab', genericName: 'Erythromycin', innName: 'Erythromycin', category: 'Antibiotics', dosage: '250-500mg every 6 hours', sideEffects: ['Nausea', 'Diarrhea', 'QT prolongation'], contraindications: ['Macrolide allergy'], pregnancyCategory: 'B' },
  { id: '36', name: 'Cipro', genericName: 'Ciprofloxacin', innName: 'Ciprofloxacin', category: 'Antibiotics', dosage: '250-750mg every 12 hours', sideEffects: ['Tendon rupture', 'QT prolongation', 'Nausea'], contraindications: ['Tendon disorders', 'Myasthenia gravis'], pregnancyCategory: 'C' },
  { id: '37', name: 'Levaquin', genericName: 'Levofloxacin', innName: 'Levofloxacin', category: 'Antibiotics', dosage: '250-750mg daily', sideEffects: ['Tendon rupture', 'QT prolongation', 'Insomnia'], contraindications: ['Tendon disorders', 'Myasthenia gravis'], pregnancyCategory: 'C' },
  { id: '38', name: 'Flagyl', genericName: 'Metronidazole', innName: 'Metronidazole', category: 'Antibiotics', dosage: '250-500mg every 8 hours', sideEffects: ['Nausea', 'Metallic taste', 'Disulfiram reaction with alcohol'], contraindications: ['First trimester pregnancy'], pregnancyCategory: 'B' },
  { id: '39', name: 'Bactrim', genericName: 'TMP-SMX', innName: 'Sulfamethoxazole-trimethoprim', category: 'Antibiotics', dosage: '160/800mg every 12 hours', sideEffects: ['Rash', 'Hyperkalemia', 'Photosensitivity'], contraindications: ['Sulfonamide allergy', 'G6PD deficiency'], pregnancyCategory: 'D' },
  { id: '40', name: 'Doxycycline', genericName: 'Doxycycline', innName: 'Doxycycline', category: 'Antibiotics', dosage: '100mg every 12 hours', sideEffects: ['Photosensitivity', 'GI upset', 'Tooth discoloration in children'], contraindications: ['Pregnancy', 'Children under 8'], pregnancyCategory: 'D' },
  { id: '41', name: 'Vibramycin', genericName: 'Tetracycline', innName: 'Tetracycline', category: 'Antibiotics', dosage: '250-500mg every 6 hours', sideEffects: ['Photosensitivity', 'GI upset', 'Tooth discoloration'], contraindications: ['Pregnancy', 'Children under 8'], pregnancyCategory: 'D' },
  { id: '42', name: 'Zyvox', genericName: 'Linezolid', innName: 'Linezolid', category: 'Antibiotics', dosage: '600mg every 12 hours', sideEffects: ['Myelosuppression', 'Serotonin syndrome'], contraindications: ['MAO inhibitor use'], pregnancyCategory: 'C' },
  
  // === ANTIFUNGALS ===
  { id: '43', name: 'Diflucan', genericName: 'Fluconazole', innName: 'Fluconazole', category: 'Antifungals', dosage: '100-400mg daily', sideEffects: ['Liver toxicity', 'QT prolongation'], contraindications: ['QT prolongation'], pregnancyCategory: 'D' },
  { id: '44', name: 'Sporanox', genericName: 'Itraconazole', innName: 'Itraconazole', category: 'Antifungals', dosage: '100-200mg daily', sideEffects: ['Liver toxicity', 'Heart failure'], contraindications: ['Heart failure'], pregnancyCategory: 'C' },
  { id: '45', name: 'Nizoral', genericName: 'Ketoconazole', innName: 'Ketoconazole', category: 'Antifungals', dosage: '200-400mg daily', sideEffects: ['Liver toxicity', 'Adrenal suppression'], contraindications: ['Liver disease'], pregnancyCategory: 'C' },
  
  // === DIABETES MEDICATIONS ===
  { id: '46', name: 'Glucophage', genericName: 'Metformin', innName: 'Metformin', category: 'Diabetes', dosage: '500-2000mg daily', sideEffects: ['Stomach upset', 'Diarrhea', 'Lactic acidosis (rare)'], contraindications: ['Kidney disease', 'Metabolic acidosis'], pregnancyCategory: 'B' },
  { id: '47', name: 'Glucotrol', genericName: 'Glipizide', innName: 'Glipizide', category: 'Diabetes', dosage: '5-40mg daily', sideEffects: ['Hypoglycemia', 'Weight gain'], contraindications: ['Type 1 diabetes', 'DKA'], pregnancyCategory: 'C' },
  { id: '48', name: 'Micronase', genericName: 'Glyburide', innName: 'Glibenclamide', category: 'Diabetes', dosage: '2.5-20mg daily', sideEffects: ['Hypoglycemia', 'Weight gain'], contraindications: ['Type 1 diabetes', 'DKA'], pregnancyCategory: 'C' },
  { id: '49', name: 'Insulin', genericName: 'Insulin', innName: 'Insulin', category: 'Diabetes', dosage: 'Individualized', sideEffects: ['Hypoglycemia', 'Weight gain'], contraindications: ['Hypoglycemia'], pregnancyCategory: 'B' },
  
  // === RESPIRATORY ===
  { id: '50', name: 'Ventolin', genericName: 'Albuterol', innName: 'Salbutamol', category: 'Respiratory', dosage: '1-2 puffs every 4-6 hours', sideEffects: ['Tremors', 'Rapid heartbeat', 'Nervousness'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '51', name: 'Advair', genericName: 'Fluticasone-salmeterol', innName: 'Fluticasone-salmeterol', category: 'Respiratory', dosage: '1-2 puffs twice daily', sideEffects: ['Thrush', 'Hoarseness', 'Tremors'], contraindications: ['Status asthmaticus'], pregnancyCategory: 'C' },
  { id: '52', name: 'Singulair', genericName: 'Montelukast', innName: 'Montelukast', category: 'Respiratory', dosage: '10mg daily', sideEffects: ['Headache', 'Neuropsychiatric effects'], contraindications: ['None major'], pregnancyCategory: 'B' },
  { id: '53', name: 'Theo-24', genericName: 'Theophylline', innName: 'Theophylline', category: 'Respiratory', dosage: '100-600mg daily', sideEffects: ['Nausea', 'Tremors', 'Seizures (toxicity)'], contraindications: ['Seizure disorders'], pregnancyCategory: 'C' },
  
  // === GI MEDICATIONS ===
  { id: '54', name: 'Prilosec', genericName: 'Omeprazole', innName: 'Omeprazole', category: 'GI', dosage: '20-40mg once daily', sideEffects: ['Headache', 'Diarrhea', 'B12 deficiency (long-term)'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '55', name: 'Nexium', genericName: 'Esomeprazole', innName: 'Esomeprazole', category: 'GI', dosage: '20-40mg once daily', sideEffects: ['Headache', 'Diarrhea'], contraindications: ['None major'], pregnancyCategory: 'B' },
  { id: '56', name: 'Prevacid', genericName: 'Lansoprazole', innName: 'Lansoprazole', category: 'GI', dosage: '15-30mg once daily', sideEffects: ['Headache', 'Diarrhea'], contraindications: ['None major'], pregnancyCategory: 'B' },
  { id: '57', name: 'Zantac', genericName: 'Ranitidine', innName: 'Ranitidine', category: 'GI', dosage: '150-300mg daily', sideEffects: ['Headache', 'Constipation'], contraindications: ['None major'], pregnancyCategory: 'B' },
  { id: '58', name: 'Pepcid', genericName: 'Famotidine', innName: 'Famotidine', category: 'GI', dosage: '20-40mg daily', sideEffects: ['Headache', 'Constipation'], contraindications: ['None major'], pregnancyCategory: 'B' },
  { id: '59', name: 'Reglan', genericName: 'Metoclopramide', innName: 'Metoclopramide', category: 'GI', dosage: '10mg 3-4 times daily', sideEffects: ['Drowsiness', 'Tardive dyskinesia (long-term)'], contraindications: ['GI obstruction', 'Seizure disorders'], pregnancyCategory: 'B' },
  
  // === CNS/PSYCHIATRY ===
  { id: '60', name: 'Zoloft', genericName: 'Sertraline', innName: 'Sertraline', category: 'CNS/Psychiatry', dosage: '25-200mg daily', sideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction'], contraindications: ['MAO inhibitors'], pregnancyCategory: 'C' },
  { id: '61', name: 'Prozac', genericName: 'Fluoxetine', innName: 'Fluoxetine', category: 'CNS/Psychiatry', dosage: '20-80mg daily', sideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction'], contraindications: ['MAO inhibitors'], pregnancyCategory: 'C' },
  { id: '62', name: 'Paxil', genericName: 'Paroxetine', innName: 'Paroxetine', category: 'CNS/Psychiatry', dosage: '10-60mg daily', sideEffects: ['Nausea', 'Drowsiness', 'Withdrawal symptoms'], contraindications: ['MAO inhibitors'], pregnancyCategory: 'D' },
  { id: '63', name: 'Lexapro', genericName: 'Escitalopram', innName: 'Escitalopram', category: 'CNS/Psychiatry', dosage: '10-20mg daily', sideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction'], contraindications: ['MAO inhibitors'], pregnancyCategory: 'C' },
  { id: '64', name: 'Cymbalta', genericName: 'Duloxetine', innName: 'Duloxetine', category: 'CNS/Psychiatry', dosage: '30-120mg daily', sideEffects: ['Nausea', 'Dry mouth', 'Constipation'], contraindications: ['MAO inhibitors', 'Uncontrolled narrow-angle glaucoma'], pregnancyCategory: 'C' },
  { id: '65', name: 'Effexor', genericName: 'Venlafaxine', innName: 'Venlafaxine', category: 'CNS/Psychiatry', dosage: '37.5-225mg daily', sideEffects: ['Nausea', 'Hypertension', 'Withdrawal symptoms'], contraindications: ['MAO inhibitors'], pregnancyCategory: 'C' },
  { id: '66', name: 'Wellbutrin', genericName: 'Bupropion', innName: 'Bupropion', category: 'CNS/Psychiatry', dosage: '150-450mg daily', sideEffects: ['Insomnia', 'Dry mouth', 'Seizure risk'], contraindications: ['Seizure disorders', 'Eating disorders'], pregnancyCategory: 'C' },
  { id: '67', name: 'Valium', genericName: 'Diazepam', innName: 'Diazepam', category: 'CNS/Psychiatry', dosage: '2-10mg 2-4 times daily', sideEffects: ['Drowsiness', 'Dependence', 'Respiratory depression'], contraindications: ['Respiratory depression', 'Acute narrow-angle glaucoma'], pregnancyCategory: 'D' },
  { id: '68', name: 'Xanax', genericName: 'Alprazolam', innName: 'Alprazolam', category: 'CNS/Psychiatry', dosage: '0.25-4mg daily', sideEffects: ['Drowsiness', 'Dependence', 'Respiratory depression'], contraindications: ['Respiratory depression', 'Acute narrow-angle glaucoma'], pregnancyCategory: 'D' },
  { id: '69', name: 'Ativan', genericName: 'Lorazepam', innName: 'Lorazepam', category: 'CNS/Psychiatry', dosage: '0.5-6mg daily', sideEffects: ['Drowsiness', 'Dependence', 'Respiratory depression'], contraindications: ['Respiratory depression', 'Acute narrow-angle glaucoma'], pregnancyCategory: 'D' },
  { id: '70', name: 'Haldol', genericName: 'Haloperidol', innName: 'Haloperidol', category: 'CNS/Psychiatry', dosage: '0.5-20mg daily', sideEffects: ['EPS', 'QT prolongation', 'Sedation'], contraindications: ['Parkinson disease', 'Coma'], pregnancyCategory: 'C' },
  { id: '71', name: 'Risperdal', genericName: 'Risperidone', innName: 'Risperidone', category: 'CNS/Psychiatry', dosage: '1-6mg daily', sideEffects: ['Weight gain', 'EPS', 'Hyperprolactinemia'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '72', name: 'Seroquel', genericName: 'Quetiapine', innName: 'Quetiapine', category: 'CNS/Psychiatry', dosage: '25-800mg daily', sideEffects: ['Sedation', 'Weight gain', 'Metabolic effects'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '73', name: 'Abilify', genericName: 'Aripiprazole', innName: 'Aripiprazole', category: 'CNS/Psychiatry', dosage: '2-30mg daily', sideEffects: ['Akathisia', 'Insomnia', 'Weight gain'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '74', name: 'Nardil', genericName: 'Phenelzine', innName: 'Phenelzine', category: 'CNS/Psychiatry', dosage: '15-90mg daily', sideEffects: ['Orthostatic hypotension', 'Hypertensive crisis with tyramine', 'Insomnia'], contraindications: ['CHF', 'Pheochromocytoma', 'SSRIs'], pregnancyCategory: 'C' },
  { id: '75', name: 'Parnate', genericName: 'Tranylcypromine', innName: 'Tranylcypromine', category: 'CNS/Psychiatry', dosage: '30-60mg daily', sideEffects: ['Orthostatic hypotension', 'Hypertensive crisis with tyramine', 'Insomnia'], contraindications: ['CHF', 'Pheochromocytoma', 'SSRIs'], pregnancyCategory: 'C' },
  { id: '76', name: 'Neurontin', genericName: 'Gabapentin', innName: 'Gabapentin', category: 'CNS/Psychiatry', dosage: '300-3600mg daily', sideEffects: ['Drowsiness', 'Dizziness', 'Weight gain'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '77', name: 'Lyrica', genericName: 'Pregabalin', innName: 'Pregabalin', category: 'CNS/Psychiatry', dosage: '75-600mg daily', sideEffects: ['Drowsiness', 'Dizziness', 'Weight gain'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '78', name: 'Methadone', genericName: 'Methadone', innName: 'Methadone', category: 'CNS/Psychiatry', dosage: '5-120mg daily', sideEffects: ['Sedation', 'Constipation', 'QT prolongation'], contraindications: ['Respiratory depression'], pregnancyCategory: 'C' },
  
  // === ANTI-EPILEPTICS ===
  { id: '79', name: 'Dilantin', genericName: 'Phenytoin', innName: 'Phenytoin', category: 'Neurology', dosage: '100-400mg daily', sideEffects: ['Gingival hyperplasia', 'Ataxia', 'Rash'], contraindications: ['Bradycardia', 'Heart block'], pregnancyCategory: 'D' },
  { id: '80', name: 'Tegretol', genericName: 'Carbamazepine', innName: 'Carbamazepine', category: 'Neurology', dosage: '200-1200mg daily', sideEffects: ['Drowsiness', 'Dizziness', 'Hyponatremia', 'Rash (SJS risk)'], contraindications: ['Bone marrow suppression', 'MAO inhibitors'], pregnancyCategory: 'D' },
  { id: '81', name: 'Depakote', genericName: 'Valproic acid', innName: 'Valproic acid', category: 'Neurology', dosage: '250-2000mg daily', sideEffects: ['Weight gain', 'Hair loss', 'Liver toxicity', 'Teratogenic'], contraindications: ['Liver disease', 'Urea cycle disorders'], pregnancyCategory: 'X' },
  { id: '82', name: 'Lamictal', genericName: 'Lamotrigine', innName: 'Lamotrigine', category: 'Neurology', dosage: '25-500mg daily', sideEffects: ['Dizziness', 'Blurred vision', 'Rash (SJS risk)'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '83', name: 'Topamax', genericName: 'Topiramate', innName: 'Topiramate', category: 'Neurology', dosage: '25-400mg daily', sideEffects: ['Cognitive slowing', 'Weight loss', 'Kidney stones'], contraindications: ['Metabolic acidosis'], pregnancyCategory: 'D' },
  { id: '84', name: 'Keppra', genericName: 'Levetiracetam', innName: 'Levetiracetam', category: 'Neurology', dosage: '500-3000mg daily', sideEffects: ['Drowsiness', 'Irritability', 'Behavior changes'], contraindications: ['None major'], pregnancyCategory: 'C' },
  
  // === MIGRAINE MEDICATIONS ===
  { id: '85', name: 'Imitrex', genericName: 'Sumatriptan', innName: 'Sumatriptan', category: 'Neurology', dosage: '25-100mg as needed', sideEffects: ['Chest tightness', 'Dizziness', 'Injection site reaction'], contraindications: ['Ischemic heart disease', 'Uncontrolled hypertension'], pregnancyCategory: 'C' },
  { id: '86', name: 'Maxalt', genericName: 'Rizatriptan', innName: 'Rizatriptan', category: 'Neurology', dosage: '5-10mg as needed', sideEffects: ['Dizziness', 'Drowsiness', 'Chest discomfort'], contraindications: ['Ischemic heart disease', 'Uncontrolled hypertension'], pregnancyCategory: 'C' },
  
  // === THYROID MEDICATIONS ===
  { id: '87', name: 'Synthroid', genericName: 'Levothyroxine', innName: 'Levothyroxine', category: 'Endocrine', dosage: '25-200mcg daily', sideEffects: ['Palpitations', 'Tremors', 'Insomnia (overdose)'], contraindications: ['Untreated adrenal insufficiency', 'Thyrotoxicosis'], pregnancyCategory: 'A' },
  { id: '88', name: 'Methimazole', genericName: 'Methimazole', innName: 'Methimazole', category: 'Endocrine', dosage: '5-60mg daily', sideEffects: ['Rash', 'Agranulocytosis (rare)', 'Liver toxicity'], contraindications: ['Pregnancy (first trimester)'], pregnancyCategory: 'D' },
  
  // === CORTICOSTEROIDS ===
  { id: '89', name: 'Prednisone', genericName: 'Prednisone', innName: 'Prednisone', category: 'Endocrine', dosage: '5-60mg daily', sideEffects: ['Weight gain', 'Hyperglycemia', 'Osteoporosis', 'Immunosuppression'], contraindications: ['Systemic fungal infections'], pregnancyCategory: 'B' },
  { id: '90', name: 'Prednisolone', genericName: 'Prednisolone', innName: 'Prednisolone', category: 'Endocrine', dosage: '5-60mg daily', sideEffects: ['Weight gain', 'Hyperglycemia', 'Osteoporosis', 'Immunosuppression'], contraindications: ['Systemic fungal infections'], pregnancyCategory: 'B' },
  { id: '91', name: 'Medrol', genericName: 'Methylprednisolone', innName: 'Methylprednisolone', category: 'Endocrine', dosage: '4-48mg daily', sideEffects: ['Weight gain', 'Hyperglycemia', 'Osteoporosis'], contraindications: ['Systemic fungal infections'], pregnancyCategory: 'C' },
  { id: '92', name: 'Decadron', genericName: 'Dexamethasone', innName: 'Dexamethasone', category: 'Endocrine', dosage: '0.5-10mg daily', sideEffects: ['Insomnia', 'Hyperglycemia', 'Mood changes'], contraindications: ['Systemic fungal infections'], pregnancyCategory: 'C' },
  
  // === IMMUNOSUPPRESSANTS ===
  { id: '93', name: 'Neoral', genericName: 'Cyclosporine', innName: 'Ciclosporin', category: 'Immunology', dosage: '2.5-15mg/kg daily', sideEffects: ['Nephrotoxicity', 'Hypertension', 'Hirsutism'], contraindications: ['Uncontrolled hypertension', 'Malignancy'], pregnancyCategory: 'C' },
  { id: '94', name: 'Prograf', genericName: 'Tacrolimus', innName: 'Tacrolimus', category: 'Immunology', dosage: '0.1-0.2mg/kg daily', sideEffects: ['Nephrotoxicity', 'Neurotoxicity', 'Diabetes'], contraindications: ['None major'], pregnancyCategory: 'C' },
  { id: '95', name: 'Rheumatrex', genericName: 'Methotrexate', innName: 'Methotrexate', category: 'Immunology', dosage: '7.5-25mg weekly', sideEffects: ['Bone marrow suppression', 'Liver toxicity', 'Mucositis'], contraindications: ['Pregnancy', 'Breastfeeding', 'Immunodeficiency'], pregnancyCategory: 'X' },
  
  // === LITHIUM ===
  { id: '96', name: 'Lithium', genericName: 'Lithium carbonate', innName: 'Lithium', category: 'CNS/Psychiatry', dosage: '300-1800mg daily', sideEffects: ['Tremor', 'Polyuria', 'Weight gain', 'Thyroid dysfunction'], contraindications: ['Severe renal impairment', 'Dehydration', 'Sodium depletion'], pregnancyCategory: 'D' },
  
  // === SUPPLEMENTS / OTC ===
  { id: '97', name: 'Potassium chloride', genericName: 'Potassium chloride', innName: 'Potassium chloride', category: 'Supplements', dosage: '10-100mEq daily', sideEffects: ['Hyperkalemia', 'GI upset'], contraindications: ['Hyperkalemia', 'Severe renal impairment'], pregnancyCategory: 'A' },
  { id: '98', name: 'Calcium carbonate', genericName: 'Calcium carbonate', innName: 'Calcium carbonate', category: 'Supplements', dosage: '500-1500mg daily', sideEffects: ['Constipation', 'Kidney stones'], contraindications: ['Hypercalcemia'], pregnancyCategory: 'A' },
  { id: '99', name: 'Ferrous sulfate', genericName: 'Iron', innName: 'Iron', category: 'Supplements', dosage: '65-325mg daily', sideEffects: ['Constipation', 'Nausea', 'Dark stools'], contraindications: ['Hemochromatosis'], pregnancyCategory: 'A' },
  { id: '100', name: 'Vitamin D', genericName: 'Cholecalciferol', innName: 'Colecalciferol', category: 'Supplements', dosage: '400-4000 IU daily', sideEffects: ['Hypercalcemia (high doses)'], contraindications: ['Hypercalcemia'], pregnancyCategory: 'A' },
  
  // === CONTRAST MEDIA ===
  { id: '101', name: 'Iodinated contrast', genericName: 'Iodinated contrast media', innName: 'Iodinated contrast', category: 'Diagnostic', dosage: 'Per procedure', sideEffects: ['Nephrotoxicity', 'Allergic reactions'], contraindications: ['Severe renal impairment', 'Prior severe reaction'], pregnancyCategory: 'C' },
  { id: '102', name: 'Contrast dye', genericName: 'Contrast media', innName: 'Contrast media', category: 'Diagnostic', dosage: 'Per procedure', sideEffects: ['Nephrotoxicity', 'Allergic reactions'], contraindications: ['Severe renal impairment'], pregnancyCategory: 'C' },
  
  // === HERBAL ===
  { id: '103', name: 'St. Johns Wort', genericName: 'Hypericum perforatum', innName: 'Hypericum perforatum', category: 'Herbal', dosage: '300mg 3 times daily', sideEffects: ['Photosensitivity', 'Drug interactions (CYP induction)'], contraindications: ['MAO inhibitors', 'Transplant patients'], pregnancyCategory: 'C' },
  
  // === ALCOHOL ===
  { id: '104', name: 'Alcohol', genericName: 'Ethanol', innName: 'Ethanol', category: 'Other', dosage: 'N/A', sideEffects: ['CNS depression', 'Hepatotoxicity', 'Drug interactions'], contraindications: ['Liver disease', 'Pregnancy', 'Addiction history'], pregnancyCategory: 'X' },
  
  // === ORAL CONTRACEPTIVES ===
  { id: '105', name: 'Birth control pills', genericName: 'Oral contraceptives', innName: 'Combined oral contraceptives', category: 'Hormones', dosage: '1 tablet daily', sideEffects: ['Nausea', 'Weight gain', 'Blood clots', 'Hypertension'], contraindications: ['History of blood clots', 'Smokers >35', 'Migraine with aura'], pregnancyCategory: 'X' },
];

const INTERACTIONS = [
  // === HIGH-RISK ANTICOAGULANT INTERACTIONS ===
  // Warfarin interactions
  { drug1: 'Warfarin', drug2: 'Aspirin', severity: 'Major', mechanism: 'Dual anticoagulant/antiplatelet effects - platelet inhibition + anticoagulation', recommendation: 'Avoid combination or monitor INR closely; severe bleeding risk' },
  { drug1: 'Warfarin', drug2: 'Ibuprofen', severity: 'Major', mechanism: 'Increased bleeding risk - platelet inhibition + gastric irritation + anticoagulation', recommendation: 'Avoid NSAIDs; consider acetaminophen for pain relief' },
  { drug1: 'Warfarin', drug2: 'Naproxen', severity: 'Major', mechanism: 'Increased bleeding risk - platelet inhibition + gastric irritation + anticoagulation', recommendation: 'Avoid NSAIDs; consider acetaminophen for pain relief' },
  { drug1: 'Warfarin', drug2: 'Clarithromycin', severity: 'Major', mechanism: 'CYP450 inhibition - increased INR and bleeding risk', recommendation: 'Monitor INR closely or use alternative antibiotic' },
  { drug1: 'Warfarin', drug2: 'Erythromycin', severity: 'Major', mechanism: 'CYP450 inhibition - increased INR and bleeding risk', recommendation: 'Monitor INR closely or use alternative antibiotic' },
  { drug1: 'Warfarin', drug2: 'Ciprofloxacin', severity: 'Major', mechanism: 'CYP inhibition and altered gut flora - increased anticoagulation', recommendation: 'Monitor INR closely; consider alternative antibiotic' },
  { drug1: 'Warfarin', drug2: 'TMP-SMX', severity: 'Major', mechanism: 'Significant increase in INR and bleeding risk', recommendation: 'Avoid combination; use alternative antibiotic' },
  { drug1: 'Warfarin', drug2: 'Trimethoprim-sulfamethoxazole', severity: 'Major', mechanism: 'Significant increase in INR and bleeding risk', recommendation: 'Avoid combination; use alternative antibiotic' },
  { drug1: 'Warfarin', drug2: 'Metronidazole', severity: 'Major', mechanism: 'CYP2C9 inhibition - increased warfarin effect', recommendation: 'Monitor INR closely; reduce warfarin dose if needed' },
  { drug1: 'Warfarin', drug2: 'Amiodarone', severity: 'Major', mechanism: 'CYP2C9/CYP1A2 inhibition - increased warfarin levels', recommendation: 'Reduce warfarin dose by 30-50%; monitor INR frequently' },
  { drug1: 'Warfarin', drug2: 'Fluconazole', severity: 'Major', mechanism: 'CYP2C9 inhibition - increased bleeding risk', recommendation: 'Monitor INR closely; consider alternative antifungal' },
  { drug1: 'Warfarin', drug2: 'Phenytoin', severity: 'Major', mechanism: 'Variable effects - initially increased then decreased anticoagulation', recommendation: 'Monitor INR frequently; complex interaction' },
  
  // === CARDIOVASCULAR DRUG INTERACTIONS ===
  // ACE inhibitors / ARBs
  { drug1: 'Lisinopril', drug2: 'Spironolactone', severity: 'Major', mechanism: 'Reduced aldosterone → potassium retention - severe hyperkalemia and arrhythmia risk', recommendation: 'Monitor potassium levels closely; avoid in renal impairment' },
  { drug1: 'Lisinopril', drug2: 'Potassium supplements', severity: 'Moderate', mechanism: 'Reduced aldosterone → potassium retention - hyperkalemia', recommendation: 'Monitor potassium levels; avoid high-dose supplements' },
  { drug1: 'Enalapril', drug2: 'Spironolactone', severity: 'Major', mechanism: 'Reduced aldosterone → potassium retention - severe hyperkalemia', recommendation: 'Monitor potassium levels closely' },
  { drug1: 'Lisinopril', drug2: 'Ibuprofen', severity: 'Moderate', mechanism: 'Reduced antihypertensive effect; renal function impairment', recommendation: 'Monitor blood pressure; avoid NSAIDs if possible' },
  { drug1: 'Lisinopril', drug2: 'Naproxen', severity: 'Moderate', mechanism: 'Reduced antihypertensive effect; renal function impairment', recommendation: 'Monitor blood pressure; avoid NSAIDs if possible' },
  // Triple Whammy
  { drug1: 'ACE inhibitor', drug2: 'NSAID + Diuretic', severity: 'Major', mechanism: 'Acute kidney injury - Triple Whammy effect', recommendation: 'Avoid combination; monitor renal function closely' },
  
  // Digoxin interactions
  { drug1: 'Digoxin', drug2: 'Amiodarone', severity: 'Major', mechanism: 'Reduced digoxin clearance - increased levels → toxicity', recommendation: 'Reduce digoxin dose by 50%; monitor levels' },
  { drug1: 'Digoxin', drug2: 'Verapamil', severity: 'Major', mechanism: 'Reduced clearance of digoxin - arrhythmia risk', recommendation: 'Reduce digoxin dose; monitor levels and ECG' },
  { drug1: 'Digoxin', drug2: 'Furosemide', severity: 'Moderate', mechanism: 'Hypokalemia increases digoxin toxicity risk', recommendation: 'Monitor potassium and digoxin levels' },
  { drug1: 'Digoxin', drug2: 'Hydrochlorothiazide', severity: 'Moderate', mechanism: 'Hypokalemia increases digoxin toxicity risk', recommendation: 'Monitor potassium and digoxin levels' },
  
  // === CNS DEPRESSION INTERACTIONS ===
  { drug1: 'Morphine', drug2: 'Diazepam', severity: 'Major', mechanism: 'Additive CNS depression - respiratory depression and sedation', recommendation: 'Avoid combination; monitor respiratory rate closely' },
  { drug1: 'Oxycodone', drug2: 'Alprazolam', severity: 'Major', mechanism: 'Additive CNS depression - respiratory depression and sedation', recommendation: 'Avoid combination; use lowest effective doses' },
  { drug1: 'Morphine', drug2: 'Lorazepam', severity: 'Major', mechanism: 'Additive CNS depression - respiratory depression risk', recommendation: 'Avoid combination; monitor respiratory function' },
  { drug1: 'Alcohol', drug2: 'Diazepam', severity: 'Major', mechanism: 'Severe CNS depression - respiratory depression', recommendation: 'Absolute contraindication; avoid alcohol' },
  { drug1: 'Alcohol', drug2: 'Alprazolam', severity: 'Major', mechanism: 'Severe CNS depression - respiratory depression', recommendation: 'Absolute contraindication; avoid alcohol' },
  { drug1: 'Oxycodone', drug2: 'Gabapentin', severity: 'Major', mechanism: 'Increased risk of respiratory depression', recommendation: 'Use caution; monitor respiratory rate' },
  { drug1: 'Morphine', drug2: 'Pregabalin', severity: 'Major', mechanism: 'Increased risk of respiratory depression', recommendation: 'Use caution; monitor respiratory rate' },
  
  // === SEROTONERGIC INTERACTIONS ===
  { drug1: 'Sertraline', drug2: 'Phenelzine', severity: 'Major', mechanism: 'Serotonin syndrome - MAO inhibitor + SSRI', recommendation: 'Absolute contraindication; 14-day washout required' },
  { drug1: 'Fluoxetine', drug2: 'Tranylcypromine', severity: 'Major', mechanism: 'Serotonin syndrome - MAO inhibitor + SSRI', recommendation: 'Absolute contraindication; 14-day washout required' },
  { drug1: 'Sertraline', drug2: 'Tramadol', severity: 'Major', mechanism: 'Serotonin syndrome risk', recommendation: 'Use caution; monitor for serotonin syndrome symptoms' },
  { drug1: 'Fluoxetine', drug2: 'Tramadol', severity: 'Major', mechanism: 'Serotonin syndrome risk', recommendation: 'Use caution; monitor for serotonin syndrome symptoms' },
  { drug1: 'Sertraline', drug2: 'Sumatriptan', severity: 'Moderate', mechanism: 'Excess serotonin activity', recommendation: 'Use caution; monitor for serotonin syndrome' },
  { drug1: 'Fluoxetine', drug2: 'Rizatriptan', severity: 'Moderate', mechanism: 'Excess serotonin activity', recommendation: 'Use caution; monitor for serotonin syndrome' },
  { drug1: 'Sertraline', drug2: 'Linezolid', severity: 'Major', mechanism: 'Serotonin syndrome - linezolid has MAO activity', recommendation: 'Avoid combination; monitor for serotonin syndrome' },
  { drug1: 'Fluoxetine', drug2: 'St. Johns Wort', severity: 'Moderate', mechanism: 'Additive serotonergic effects', recommendation: 'Avoid combination; monitor for serotonin syndrome' },
  
  // === METABOLIC / CYP450 INTERACTIONS ===
  // Statins
  { drug1: 'Simvastatin', drug2: 'Clarithromycin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels → myopathy/rhabdomyolysis', recommendation: 'Use alternative antibiotic or hold statin' },
  { drug1: 'Atorvastatin', drug2: 'Clarithromycin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels', recommendation: 'Use alternative antibiotic or reduce statin dose' },
  { drug1: 'Simvastatin', drug2: 'Erythromycin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels', recommendation: 'Use alternative antibiotic or hold statin' },
  { drug1: 'Atorvastatin', drug2: 'Itraconazole', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels', recommendation: 'Avoid combination; use alternative antifungal' },
  { drug1: 'Simvastatin', drug2: 'Ketoconazole', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels', recommendation: 'Avoid combination' },
  { drug1: 'Atorvastatin', drug2: 'Grapefruit juice', severity: 'Moderate', mechanism: 'CYP3A4 inhibition - increased drug levels', recommendation: 'Avoid grapefruit juice while on statin' },
  { drug1: 'Simvastatin', drug2: 'Grapefruit juice', severity: 'Moderate', mechanism: 'CYP3A4 inhibition - increased drug levels', recommendation: 'Avoid grapefruit juice while on statin' },
  
  // Other CYP interactions
  { drug1: 'Carbamazepine', drug2: 'Oral contraceptives', severity: 'Major', mechanism: 'Enzyme induction - reduced contraceptive effectiveness', recommendation: 'Use alternative contraception method' },
  { drug1: 'Rifampin', drug2: 'Warfarin', severity: 'Major', mechanism: 'Enzyme induction - reduced anticoagulation', recommendation: 'Monitor INR closely; may need warfarin dose increase' },
  { drug1: 'Rifampin', drug2: 'Oral contraceptives', severity: 'Major', mechanism: 'Enzyme induction - reduced contraceptive effectiveness', recommendation: 'Use alternative contraception method' },
  { drug1: 'Phenytoin', drug2: 'Oral contraceptives', severity: 'Major', mechanism: 'Enzyme induction - reduced contraceptive effectiveness', recommendation: 'Use alternative contraception method' },
  
  // === ANTIBIOTIC-RELATED INTERACTIONS ===
  { drug1: 'Theophylline', drug2: 'Ciprofloxacin', severity: 'Major', mechanism: 'CYP1A2 inhibition - increased theophylline levels → seizures/toxicity', recommendation: 'Monitor theophylline levels; reduce dose if needed' },
  { drug1: 'Erythromycin', drug2: 'Verapamil', severity: 'Major', mechanism: 'CYP3A4 inhibition - hypotension risk', recommendation: 'Monitor blood pressure; use alternative antibiotic' },
  { drug1: 'Clarithromycin', drug2: 'Amlodipine', severity: 'Moderate', mechanism: 'CYP3A4 inhibition - increased calcium channel blocker levels', recommendation: 'Monitor blood pressure; may need dose adjustment' },
  { drug1: 'Metronidazole', drug2: 'Alcohol', severity: 'Major', mechanism: 'Disulfiram-like reaction - severe nausea, vomiting, flushing', recommendation: 'Absolute contraindication; avoid alcohol during and 48h after' },
  
  // === ENDOCRINE / METABOLIC INTERACTIONS ===
  { drug1: 'Metformin', drug2: 'Contrast dye', severity: 'Major', mechanism: 'Risk of lactic acidosis in renal impairment', recommendation: 'Hold metformin 48 hours before/after contrast; check renal function' },
  { drug1: 'Metformin', drug2: 'Iodinated contrast', severity: 'Major', mechanism: 'Risk of lactic acidosis in renal impairment', recommendation: 'Hold metformin 48 hours before/after contrast' },
  { drug1: 'Glyburide', drug2: 'Fluconazole', severity: 'Major', mechanism: 'CYP2C9 inhibition - severe hypoglycemia risk', recommendation: 'Monitor blood glucose closely; reduce sulfonylurea dose' },
  { drug1: 'Glipizide', drug2: 'Fluconazole', severity: 'Major', mechanism: 'CYP2C9 inhibition - severe hypoglycemia risk', recommendation: 'Monitor blood glucose closely; reduce sulfonylurea dose' },
  
  // === GI ABSORPTION INTERACTIONS ===
  { drug1: 'Levothyroxine', drug2: 'Omeprazole', severity: 'Moderate', mechanism: 'Reduced levothyroxine absorption', recommendation: 'Take levothyroxine on empty stomach; separate by 4 hours' },
  { drug1: 'Levothyroxine', drug2: 'Calcium supplements', severity: 'Moderate', mechanism: 'Reduced levothyroxine absorption', recommendation: 'Separate by at least 4 hours' },
  { drug1: 'Levothyroxine', drug2: 'Iron supplements', severity: 'Moderate', mechanism: 'Reduced levothyroxine absorption', recommendation: 'Separate by at least 4 hours' },
  { drug1: 'Tetracycline', drug2: 'Calcium supplements', severity: 'Moderate', mechanism: 'Chelation - reduced antibiotic absorption', recommendation: 'Separate by 2-3 hours' },
  { drug1: 'Doxycycline', drug2: 'Iron supplements', severity: 'Moderate', mechanism: 'Chelation - reduced antibiotic absorption', recommendation: 'Separate by 2-3 hours' },
  { drug1: 'Ciprofloxacin', drug2: 'Calcium supplements', severity: 'Moderate', mechanism: 'Chelation - reduced antibiotic absorption', recommendation: 'Separate by 2-3 hours' },
  
  // === ADDITIONAL IMPORTANT INTERACTIONS ===
  { drug1: 'Lithium', drug2: 'Lisinopril', severity: 'Major', mechanism: 'Reduced lithium clearance - lithium toxicity risk', recommendation: 'Monitor lithium levels closely; reduce lithium dose' },
  { drug1: 'Lithium', drug2: 'Hydrochlorothiazide', severity: 'Major', mechanism: 'Reduced lithium clearance - lithium toxicity risk', recommendation: 'Monitor lithium levels closely; reduce lithium dose' },
  { drug1: 'Lithium', drug2: 'Furosemide', severity: 'Major', mechanism: 'Reduced lithium clearance - lithium toxicity risk', recommendation: 'Monitor lithium levels closely; reduce lithium dose' },
  { drug1: 'Ibuprofen', drug2: 'Prednisone', severity: 'Moderate', mechanism: 'Increased GI bleeding risk', recommendation: 'Use PPI for GI protection; avoid if possible' },
  { drug1: 'Naproxen', drug2: 'Prednisolone', severity: 'Moderate', mechanism: 'Increased GI bleeding risk', recommendation: 'Use PPI for GI protection; avoid if possible' },
  { drug1: 'Methotrexate', drug2: 'Ibuprofen', severity: 'Major', mechanism: 'Reduced methotrexate clearance - toxicity risk', recommendation: 'Avoid NSAIDs with high-dose methotrexate' },
  { drug1: 'Methotrexate', drug2: 'Trimethoprim-sulfamethoxazole', severity: 'Major', mechanism: 'Additive antifolate effect - bone marrow suppression', recommendation: 'Avoid combination' },
  
  // === ANTIARRHYTHMIC INTERACTIONS ===
  { drug1: 'Amiodarone', drug2: 'Simvastatin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels', recommendation: 'Limit simvastatin dose to 20mg or use alternative statin' },
  { drug1: 'Amiodarone', drug2: 'Warfarin', severity: 'Major', mechanism: 'CYP2C9 inhibition - increased bleeding risk', recommendation: 'Reduce warfarin dose by 30-50%' },
  { drug1: 'Sotalol', drug2: 'Furosemide', severity: 'Major', mechanism: 'Hypokalemia increases arrhythmia risk', recommendation: 'Monitor potassium and magnesium levels' },
  
  // === IMMUNOSUPPRESSANT INTERACTIONS ===
  { drug1: 'Cyclosporine', drug2: 'Ketoconazole', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased cyclosporine levels', recommendation: 'Monitor cyclosporine levels closely' },
  { drug1: 'Tacrolimus', drug2: 'Clarithromycin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased tacrolimus levels', recommendation: 'Monitor tacrolimus levels; reduce dose if needed' },
  { drug1: 'Cyclosporine', drug2: 'Simvastatin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased statin levels', recommendation: 'Avoid combination; use pravastatin instead' },
  
  // === ANTI-EPILEPTIC INTERACTIONS ===
  { drug1: 'Valproic acid', drug2: 'Aspirin', severity: 'Major', mechanism: 'Displacement from protein binding - increased valproate levels', recommendation: 'Monitor valproate levels; reduce dose if needed' },
  { drug1: 'Carbamazepine', drug2: 'Erythromycin', severity: 'Major', mechanism: 'CYP3A4 inhibition - increased carbamazepine levels', recommendation: 'Monitor carbamazepine levels; use alternative antibiotic' },
  
  // === QT PROLONGATION INTERACTIONS ===
  { drug1: 'Haloperidol', drug2: 'Ciprofloxacin', severity: 'Major', mechanism: 'Additive QT prolongation - torsades de pointes risk', recommendation: 'Avoid combination; monitor ECG if unavoidable' },
  { drug1: 'Amiodarone', drug2: 'Haloperidol', severity: 'Major', mechanism: 'Additive QT prolongation - torsades de pointes risk', recommendation: 'Avoid combination; monitor ECG closely' },
  { drug1: 'Methadone', drug2: 'Fluconazole', severity: 'Major', mechanism: 'CYP inhibition + QT prolongation', recommendation: 'Avoid combination; monitor ECG if unavoidable' },
];

const MINOR_AILMENTS = [
  { id: '1', name: 'Headache', icon: Zap, symptoms: ['Pain in head', 'Sensitivity to light', 'Nausea'], selfCare: ['Rest in quiet room', 'Apply cold compress', 'Stay hydrated'], otcOptions: ['Acetaminophen', 'Ibuprofen', 'Aspirin'], whenToSeeDoctor: 'Severe or persistent headache, fever with stiff neck', precautions: 'Avoid overuse of pain medications' },
  { id: '2', name: 'Common Cold', icon: Wind, symptoms: ['Runny nose', 'Sneezing', 'Sore throat', 'Cough'], selfCare: ['Rest', 'Drink fluids', 'Use humidifier'], otcOptions: ['Decongestants', 'Antihistamines', 'Cough syrup'], whenToSeeDoctor: 'High fever, difficulty breathing, symptoms > 10 days', precautions: 'Wash hands frequently' },
  { id: '3', name: 'Heartburn', icon: Flame, symptoms: ['Burning in chest', 'Sour taste', 'Difficulty swallowing'], selfCare: ['Avoid trigger foods', 'Eat smaller meals', 'Don\'t lie down after eating'], otcOptions: ['Antacids', 'H2 blockers', 'Proton pump inhibitors'], whenToSeeDoctor: 'Frequent episodes, chest pain with exertion', precautions: 'Limit caffeine, alcohol, and spicy foods' },
  { id: '4', name: 'Seasonal Allergies', icon: Wind, symptoms: ['Sneezing', 'Itchy eyes', 'Runny nose', 'Congestion'], selfCare: ['Avoid allergens', 'Use air purifier', 'Rinse sinuses'], otcOptions: ['Antihistamines', 'Nasal sprays', 'Eye drops'], whenToSeeDoctor: 'Severe symptoms, asthma symptoms', precautions: 'Check pollen forecasts' },
  { id: '5', name: 'Constipation', icon: Activity, symptoms: ['Infrequent bowel movements', 'Hard stools', 'Straining'], selfCare: ['Increase fiber', 'Drink more water', 'Exercise regularly'], otcOptions: ['Fiber supplements', 'Stool softeners', 'Laxatives'], whenToSeeDoctor: 'Severe pain, blood in stool, sudden change', precautions: 'Don\'t overuse laxatives' },
  { id: '6', name: 'Diarrhea', icon: Droplets, symptoms: ['Loose stools', 'Stomach cramps', 'Dehydration'], selfCare: ['Drink oral rehydration solution', 'Eat bland foods', 'Rest'], otcOptions: ['Loperamide', 'Bismuth subsalicylate'], whenToSeeDoctor: 'Blood in stool, high fever, severe dehydration', precautions: 'Stay hydrated, avoid dairy' },
  { id: '7', name: 'Muscle Pain', icon: Activity, symptoms: ['Aching muscles', 'Stiffness', 'Limited movement'], selfCare: ['Rest affected area', 'Apply ice then heat', 'Gentle stretching'], otcOptions: ['Ibuprofen', 'Acetaminophen', 'Topical analgesics'], whenToSeeDoctor: 'Severe pain, swelling, inability to move', precautions: 'Don\'t exceed recommended doses' },
  { id: '8', name: 'Insomnia', icon: Moon, symptoms: ['Difficulty falling asleep', 'Waking frequently', 'Daytime fatigue'], selfCare: ['Maintain sleep schedule', 'Avoid screens before bed', 'Create bedtime routine'], otcOptions: ['Melatonin', 'Diphenhydramine'], whenToSeeDoctor: 'Persistent insomnia > 3 weeks, depression symptoms', precautions: 'Avoid caffeine in afternoon' },
  { id: '9', name: 'Sore Throat', icon: Activity, symptoms: ['Pain when swallowing', 'Redness', 'Swollen glands'], selfCare: ['Gargle salt water', 'Drink warm fluids', 'Use throat lozenges'], otcOptions: ['Throat sprays', 'Lozenges', 'Pain relievers'], whenToSeeDoctor: 'High fever, difficulty breathing, rash', precautions: 'Replace toothbrush after recovery' },
  { id: '10', name: 'Dry Cough', icon: Wind, symptoms: ['Non-productive cough', 'Tickle in throat', 'Worse at night'], selfCare: ['Stay hydrated', 'Use humidifier', 'Avoid irritants'], otcOptions: ['Dextromethorphan', 'Honey (adults)'], whenToSeeDoctor: 'Cough > 3 weeks, blood, difficulty breathing', precautions: 'Avoid giving honey to children < 1 year' },
  { id: '11', name: 'Sunburn', icon: Sun, symptoms: ['Red skin', 'Pain', 'Warmth', 'Blisters (severe)'], selfCare: ['Cool compress', 'Aloe vera gel', 'Stay hydrated'], otcOptions: ['Pain relievers', 'Hydrocortisone cream', 'Moisturizing lotion'], whenToSeeDoctor: 'Severe blistering, fever, dehydration', precautions: 'Use sunscreen SPF 30+' },
  { id: '12', name: 'Minor Cuts', icon: Bandage, symptoms: ['Bleeding', 'Pain', 'Swelling'], selfCare: ['Clean with water', 'Apply pressure', 'Cover with bandage'], otcOptions: ['Antibiotic ointment', 'Bandages', 'Pain relievers'], whenToSeeDoctor: 'Deep wounds, uncontrolled bleeding, signs of infection', precautions: 'Keep wound clean and dry' },
];

// Main App Component
function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [country, setCountry] = useState('Egypt');
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleContinue = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'patient') {
      setCurrentScreen('patient-profile');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleProfileComplete = (profile: any) => {
    setPatientProfile(profile);
    setCurrentScreen('dashboard');
  };

  const handleGuestContinue = () => {
    setIsGuest(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setPatientProfile(null);
    setIsGuest(false);
    setCurrentScreen('landing');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {currentScreen === 'landing' && (
        <LandingScreen onContinue={handleContinue} darkMode={darkMode} />
      )}
      {currentScreen === 'role-selection' && (
        <RoleSelectionScreen onSelect={handleRoleSelect} onBack={() => setCurrentScreen('landing')} darkMode={darkMode} />
      )}
      {currentScreen === 'patient-profile' && (
        <PatientProfileScreen onComplete={handleProfileComplete} onGuest={handleGuestContinue} onBack={() => setCurrentScreen('role-selection')} darkMode={darkMode} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard 
          userRole={userRole} 
          patientProfile={patientProfile} 
          isGuest={isGuest}
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          country={country}
          setCountry={setCountry}
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatScreen 
          userRole={userRole} 
          darkMode={darkMode} 
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'drug-database' && (
        <DrugDatabaseScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'interaction-checker' && (
        <InteractionCheckerScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'dose-calculator' && (
        <DoseCalculatorScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} patientProfile={patientProfile} />
      )}
      {currentScreen === 'timer' && (
        <TimerScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'converter' && (
        <ConverterScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'admin-guide' && (
        <AdminGuideScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'hazardous' && (
        <HazardousScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'my-medications' && (
        <MyMedicationsScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'minor-ailments' && (
        <MinorAilmentsScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'compounding' && (
        <CompoundingScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'tdm' && (
        <TDMScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'clinical-calculators' && (
        <ClinicalCalculatorsScreen darkMode={darkMode} onBack={() => setCurrentScreen('dashboard')} />
      )}
    </div>
  );
}

// Landing Screen
function LandingScreen({ onContinue, darkMode }: { onContinue: () => void; darkMode: boolean }) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <img 
            src="/logo.png" 
            alt="RxCompanion Logo" 
            className="w-96 h-auto mx-auto"
          />
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          RxCompanion
        </h1>
        <p className={`text-xl md:text-2xl mb-2 font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          Simplifying Prescriptions. Amplifying Health.
        </p>
        <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Your Personal Medication Safety Assistant
        </p>
        <Button 
          onClick={onContinue}
          className="px-12 py-6 text-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Continue
          <ChevronRight className="ml-2 w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

// Role Selection Screen
function RoleSelectionScreen({ onSelect, onBack, darkMode }: { onSelect: (role: UserRole) => void; onBack: () => void; darkMode: boolean }) {
  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto pt-12">
        <Button variant="ghost" onClick={onBack} className="mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        <h2 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          How would you like to use RxCompanion?
        </h2>
        <p className={`text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Select your role to continue
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className={`cursor-pointer hover:shadow-xl transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            onClick={() => onSelect('patient')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6 mx-auto">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Patient
              </h3>
              <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Access personalized medication guidance, check interactions, and manage your prescriptions safely.
              </p>
              <Button className="w-full" variant="outline">
                Continue as Patient
              </Button>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-xl transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            onClick={() => onSelect('pharmacist')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 mx-auto">
                <Stethoscope className="w-10 h-10 text-green-600" />
              </div>
              <h3 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Pharmacist
              </h3>
              <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Access the full drug database, provide patient counseling, and use professional tools.
              </p>
              <ul className={`text-sm mb-6 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Complete Drug Database (100+ drugs)</li>
                <li>• Patient Live Chat & Consultation</li>
                <li>• Advanced Interaction Analysis</li>
                <li>• Patient Management System</li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Enter Professional Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Patient Profile Screen
function PatientProfileScreen({ onComplete, onGuest, onBack, darkMode }: { onComplete: (profile: any) => void; onGuest: () => void; onBack: () => void; darkMode: boolean }) {
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    weight: '',
    gender: '',
    kidneyFunction: 'normal',
    liverFunction: 'normal',
    allergies: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto pt-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Create Your Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Full Name</Label>
                  <Input 
                    value={profile.fullName}
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    placeholder="John Doe"
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Age</Label>
                  <Input 
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: e.target.value})}
                    placeholder="35"
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Weight (kg)</Label>
                  <Input 
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({...profile, weight: e.target.value})}
                    placeholder="70"
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Gender</Label>
                  <Select value={profile.gender} onValueChange={(v) => setProfile({...profile, gender: v})}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>Kidney Function</Label>
                <Select value={profile.kidneyFunction} onValueChange={(v) => setProfile({...profile, kidneyFunction: v})}>
                  <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="mild">Mild Impairment</SelectItem>
                    <SelectItem value="moderate">Moderate Impairment</SelectItem>
                    <SelectItem value="severe">Severe Impairment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>Liver Function</Label>
                <Select value={profile.liverFunction} onValueChange={(v) => setProfile({...profile, liverFunction: v})}>
                  <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="mild">Mild Impairment</SelectItem>
                    <SelectItem value="moderate">Moderate Impairment</SelectItem>
                    <SelectItem value="severe">Severe Impairment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>Allergies (if any)</Label>
                <Textarea 
                  value={profile.allergies}
                  onChange={(e) => setProfile({...profile, allergies: e.target.value})}
                  placeholder="e.g., Penicillin, Sulfa drugs"
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Create Profile
                </Button>
                <Button type="button" variant="outline" onClick={onGuest} className={darkMode ? 'border-gray-600 text-gray-300' : ''}>
                  Continue as Guest
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ 
  userRole, 
  patientProfile, 
  isGuest, 
  darkMode, 
  setDarkMode, 
  country, 
  setCountry, 
  onNavigate, 
  onLogout 
}: { 
  userRole: UserRole; 
  patientProfile: any; 
  isGuest: boolean;
  darkMode: boolean; 
  setDarkMode: (v: boolean) => void;
  country: string;
  setCountry: (v: string) => void;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const displayName = isGuest 
    ? 'Guest' 
    : userRole === 'pharmacist' 
      ? 'Dr. Pharmacist' 
      : patientProfile?.fullName || 'Patient';

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Pill className="w-6 h-6 text-blue-600" />
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>RxCompanion</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <SidebarButton icon={Pill} label="Dashboard" onClick={() => onNavigate('dashboard')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={Beaker} label="Interaction Checker" onClick={() => onNavigate('interaction-checker')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={Calculator} label="Dose Calculator" onClick={() => onNavigate('dose-calculator')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={Clock} label="Next Dose Timer" onClick={() => onNavigate('timer')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={Activity} label="Household Converter" onClick={() => onNavigate('converter')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={BookOpen} label="Administration Guide" onClick={() => onNavigate('admin-guide')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={Shield} label="Hazardous Drug Safety" onClick={() => onNavigate('hazardous')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={Search} label="Drug Database" onClick={() => onNavigate('drug-database')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            {userRole === 'patient' && (
              <SidebarButton icon={Heart} label="My Medications" onClick={() => onNavigate('my-medications')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            )}
            <SidebarButton icon={Zap} label="Minor Ailments" onClick={() => onNavigate('minor-ailments')} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            <SidebarButton icon={MessageSquare} label="Live Chat" onClick={() => onNavigate('chat')} sidebarOpen={sidebarOpen} darkMode={darkMode} active />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex items-center justify-between`}>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {userRole === 'pharmacist' ? 'Professional Mode' : 'Patient Dashboard'}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome, {displayName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-32">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Egypt">Egypt</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {userRole === 'pharmacist' ? (
            <PharmacistDashboard onNavigate={onNavigate} darkMode={darkMode} />
          ) : (
            <PatientDashboard onNavigate={onNavigate} darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
}

// Pharmacist Dashboard - Enhanced with Advanced Medical Features
function PharmacistDashboard({ onNavigate, darkMode }: { onNavigate: (screen: Screen) => void; darkMode: boolean }) {
  // Clinical decision support alerts
  const clinicalAlerts = [
    { id: 1, type: 'critical', patient: 'Ahmed Hassan', message: 'INR > 4.5 - Warfarin dose adjustment needed', time: '10 min ago' },
    { id: 2, type: 'warning', patient: 'Sarah Johnson', message: 'Potential DDI: Simvastatin + Clarithromycin', time: '25 min ago' },
    { id: 3, type: 'info', patient: 'Mohamed Ali', message: 'Therapeutic drug monitoring due for Digoxin', time: '1 hour ago' },
  ];

  // Pending prescriptions for review
  const pendingPrescriptions = [
    { id: 1, patient: 'Fatima Omar', medication: 'Amoxicillin 500mg', status: 'pending', priority: 'normal' },
    { id: 2, patient: 'John Smith', medication: 'Metformin 1000mg', status: 'pending', priority: 'high' },
    { id: 3, patient: 'Ahmed Hassan', medication: 'Warfarin 5mg', status: 'requires_review', priority: 'critical' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              Welcome to RxCompanion Professional
            </h3>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Simplifying Prescriptions. Amplifying Health.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-500">Online</Badge>
            <Badge variant="outline">Licensed Pharmacist</Badge>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid md:grid-cols-5 gap-4">
        <StatCard title="Active Patients" value="24" icon={Users} darkMode={darkMode} />
        <StatCard title="Pending Reviews" value="3" icon={ClipboardList} darkMode={darkMode} />
        <StatCard title="Critical Alerts" value="1" icon={AlertTriangle} darkMode={darkMode} />
        <StatCard title="Drugs in DB" value="105" icon={Pill} darkMode={darkMode} />
        <StatCard title="Interactions" value="127" icon={Beaker} darkMode={darkMode} />
      </div>

      {/* Clinical Decision Support Alerts */}
      <Card className={`border-l-4 ${darkMode ? 'bg-gray-800 border-gray-700 border-l-red-500' : 'bg-white border-l-red-500'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Clinical Decision Support Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clinicalAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${
                alert.type === 'critical' ? (darkMode ? 'bg-red-900/30' : 'bg-red-50') :
                alert.type === 'warning' ? (darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50') :
                (darkMode ? 'bg-blue-900/30' : 'bg-blue-50')
              }`}>
                <div className="flex items-center gap-3">
                  <Badge className={
                    alert.type === 'critical' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }>
                    {alert.type.toUpperCase()}
                  </Badge>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{alert.patient}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alert.message}</p>
                  </div>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{alert.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Prescriptions */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <ClipboardList className="w-5 h-5" />
              Pending Prescription Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPrescriptions.map((rx) => (
                <div key={rx.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{rx.patient}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rx.medication}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      rx.priority === 'critical' ? 'bg-red-500' :
                      rx.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                    }>
                      {rx.priority}
                    </Badge>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Users className="w-5 h-5" />
              Recent Patient Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_PATIENTS.slice(0, 4).map((patient) => (
                <div key={patient.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${patient.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{patient.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{patient.lastMessage}</p>
                    </div>
                  </div>
                  {patient.unread > 0 && (
                    <Badge className="bg-red-500">{patient.unread}</Badge>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => onNavigate('chat')}>
              View All Patients
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Professional Tools Grid */}
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Professional Clinical Tools</h3>
      <div className="grid md:grid-cols-4 gap-4">
        <QuickAccessCard icon={Beaker} title="Interaction Checker" onClick={() => onNavigate('interaction-checker')} darkMode={darkMode} />
        <QuickAccessCard icon={Calculator} title="Dose Calculator" onClick={() => onNavigate('dose-calculator')} darkMode={darkMode} />
        <QuickAccessCard icon={Search} title="Drug Database" onClick={() => onNavigate('drug-database')} darkMode={darkMode} />
        <QuickAccessCard icon={BookOpen} title="Admin Guide" onClick={() => onNavigate('admin-guide')} darkMode={darkMode} />
        <QuickAccessCard icon={Clock} title="Dose Timer" onClick={() => onNavigate('timer')} darkMode={darkMode} />
        <QuickAccessCard icon={Activity} title="Unit Converter" onClick={() => onNavigate('converter')} darkMode={darkMode} />
        <QuickAccessCard icon={Shield} title="Hazardous Drugs" onClick={() => onNavigate('hazardous')} darkMode={darkMode} />
        <QuickAccessCard icon={MessageSquare} title="Patient Chat" onClick={() => onNavigate('chat')} darkMode={darkMode} />
      </div>

      {/* Advanced Pharmacist Tools */}
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Advanced Pharmacy Tools</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <FeatureCard 
          icon={FlaskConical} 
          title="Compounding Guide" 
          description="Non-sterile and sterile compounding procedures, calculations, and stability data"
          onClick={() => onNavigate('compounding')}
          darkMode={darkMode}
        />
        <FeatureCard 
          icon={Activity} 
          title="TDM Reference" 
          description="Therapeutic drug monitoring ranges, sampling times, and interpretation"
          onClick={() => onNavigate('tdm')}
          darkMode={darkMode}
        />
        <FeatureCard 
          icon={Calculator} 
          title="Clinical Calculators" 
          description="BMI, CrCl, BSA, CHA₂DS₂-VASc, HAS-BLED, and other clinical scores"
          onClick={() => onNavigate('clinical-calculators')}
          darkMode={darkMode}
        />
      </div>

      {/* Additional Resources */}
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Clinical Resources</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <FeatureCard 
          icon={Zap} 
          title="Minor Ailments" 
          description="Evidence-based self-care guidance for common conditions"
          onClick={() => onNavigate('minor-ailments')}
          darkMode={darkMode}
        />
        <FeatureCard 
          icon={FileText} 
          title="Clinical References" 
          description="Quick access to therapeutic guidelines and dosing references"
          onClick={() => onNavigate('drug-database')}
          darkMode={darkMode}
        />
        <FeatureCard 
          icon={Heart} 
          title="Patient Education" 
          description="Medication counseling resources and patient handouts"
          onClick={() => onNavigate('admin-guide')}
          darkMode={darkMode}
        />
      </div>

      {/* Reference Database Logos */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border'}`}>
        <p className={`text-sm text-center mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Trusted References & Databases
        </p>
        <div className="flex justify-center items-center gap-8">
          <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
            <img src="/pubmed.png" alt="PubMed" className="h-10 w-auto" />
          </a>
          <a href="https://go.drugbank.com/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
            <img src="/drugbank.png" alt="DrugBank" className="h-10 w-auto" />
          </a>
          <a href="https://www.pharmacists.ca/cps/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
            <img src="/cps.png" alt="CPS - Canadian Compendium" className="h-10 w-auto" />
          </a>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
        <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
          <strong>Medical Disclaimer:</strong> RxCompanion provides educational information and should not replace professional medical advice. Always consult your healthcare provider before making any changes to medication regimens.
        </p>
      </div>
    </div>
  );
}

// Patient Dashboard
function PatientDashboard({ onNavigate, darkMode }: { onNavigate: (screen: Screen) => void; darkMode: boolean }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Drugs in DB" value="100+" icon={Pill} darkMode={darkMode} />
        <StatCard title="My Medications" value="0" icon={Heart} darkMode={darkMode} />
        <StatCard title="Chat Messages" value="0" icon={MessageSquare} darkMode={darkMode} />
        <StatCard title="Interactions Checked" value="0" icon={Beaker} darkMode={darkMode} />
      </div>

      {/* Quick Access */}
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Essential Tools</h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <QuickAccessCard icon={Beaker} title="Interactions" onClick={() => onNavigate('interaction-checker')} darkMode={darkMode} />
        <QuickAccessCard icon={Calculator} title="Dose Calc" onClick={() => onNavigate('dose-calculator')} darkMode={darkMode} />
        <QuickAccessCard icon={Clock} title="Timer" onClick={() => onNavigate('timer')} darkMode={darkMode} />
        <QuickAccessCard icon={Activity} title="Converter" onClick={() => onNavigate('converter')} darkMode={darkMode} />
        <QuickAccessCard icon={BookOpen} title="Guide" onClick={() => onNavigate('admin-guide')} darkMode={darkMode} />
        <QuickAccessCard icon={Shield} title="Safety" onClick={() => onNavigate('hazardous')} darkMode={darkMode} />
      </div>

      {/* More Features */}
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>More Features</h3>
      <div className="grid md:grid-cols-4 gap-4">
        <FeatureCard 
          icon={Search} 
          title="Drug Database" 
          description="Search 100+ medications"
          onClick={() => onNavigate('drug-database')}
          darkMode={darkMode}
        />
        <FeatureCard 
          icon={Heart} 
          title="My Medications" 
          description="Track your prescriptions"
          onClick={() => onNavigate('my-medications')}
          darkMode={darkMode}
        />
        <FeatureCard 
          icon={Zap} 
          title="Minor Ailments" 
          description="Self-care guidance"
          onClick={() => onNavigate('minor-ailments')}
          darkMode={darkMode}
          popular
        />
        <FeatureCard 
          icon={MessageSquare} 
          title="Live Chat" 
          description="Talk to a pharmacist"
          onClick={() => onNavigate('chat')}
          darkMode={darkMode}
        />
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
        <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
          <strong>Medical Disclaimer:</strong> RxCompanion provides educational information and should not replace professional medical advice. Always consult your healthcare provider before making any changes to your medication regimen.
        </p>
      </div>
    </div>
  );
}

// Chat Screen - Different for Patient vs Pharmacist
function ChatScreen({ userRole, darkMode, onBack }: { userRole: UserRole; darkMode: boolean; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'pharmacist', text: 'Welcome to RxCompanion Live Chat! How can I assist you today?', timestamp: new Date(Date.now() - 3600000) }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pharmacist sees patient list
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    if (userRole === 'pharmacist') {
      // Pharmacist sends message to selected patient
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'pharmacist',
        text: inputMessage,
        timestamp: new Date(),
        patientId: selectedPatient?.id
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate patient response
      setTimeout(() => {
        const responses = [
          'Thank you for the information!',
          'I understand, I will follow your advice.',
          'Can you explain that again?',
          'What about the side effects?',
          'Should I take it with food?'
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'patient',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          patientId: selectedPatient?.id
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    } else {
      // Patient sends message
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'patient',
        text: inputMessage,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate pharmacist response
      setTimeout(() => {
        const responses = [
          'Thank you for reaching out. Based on your question, I recommend consulting with your doctor about this medication.',
          'That\'s a great question. Generally, it\'s safe to take as prescribed, but always follow your healthcare provider\'s instructions.',
          'I understand your concern. Let me check the drug database for more information on that.',
          'For your safety, please make sure to mention any allergies you have when taking new medications.',
          'It\'s important to take this medication at the same time each day for best results.'
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'pharmacist',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  if (userRole === 'pharmacist') {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex items-center gap-4`}>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Patient Consultations
          </h2>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Patient List */}
          <div className={`w-80 ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r'} overflow-auto`}>
            <div className="p-4">
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Patients</h3>
              <div className="space-y-2">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${patient.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{patient.name}</span>
                      </div>
                      {patient.unread > 0 && (
                        <Badge className="bg-red-500">{patient.unread}</Badge>
                      )}
                    </div>
                    <p className={`text-sm mt-1 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {patient.lastMessage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedPatient ? (
              <>
                <div className={`p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPatient.name}</p>
                      <p className={`text-sm ${selectedPatient.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                        {selectedPatient.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'pharmacist' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender === 'pharmacist'
                              ? 'bg-blue-600 text-white'
                              : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'pharmacist' ? 'text-blue-200' : 'text-gray-500'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <div className="flex gap-2">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className={`flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select a patient to start consultation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Patient Chat View
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex items-center gap-4`}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pharmacist Support</h2>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className={`p-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} m-4 rounded-lg`}>
          <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            <strong>Welcome to RxCompanion Live Chat</strong><br />
            A pharmacist will assist you shortly. Please be specific about your medications and symptoms.
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'patient'
                      ? 'bg-blue-600 text-white'
                      : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'patient' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your medications..."
              className={`flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>

        <div className={`p-4 ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'} m-4 rounded-lg`}>
          <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
            <strong>Chat Guidelines:</strong><br />
            Be specific about your medications and symptoms. Include dosage and timing information. 
            Mention any allergies. For emergencies, call emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

// Drug Database Screen
function DrugDatabaseScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  const filteredDrugs = DRUG_DATABASE.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.innName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Drug Database
        </h2>

        <div className="mb-6">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by brand name, generic name, or INN..."
            className={`w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrugs.map((drug) => (
            <Card 
              key={drug.id} 
              className={`cursor-pointer hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
              onClick={() => setSelectedDrug(drug)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{drug.name}</h3>
                  <Badge variant="outline">{drug.category}</Badge>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Generic:</strong> {drug.genericName}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>INN:</strong> {drug.innName}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedDrug} onOpenChange={() => setSelectedDrug(null)}>
          <DialogContent className={`max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={darkMode ? 'text-white' : 'text-gray-800'}>
                {selectedDrug?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedDrug && (
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>Generic Name:</strong> {selectedDrug.genericName}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>INN Name:</strong> {selectedDrug.innName}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>Category:</strong> {selectedDrug.category}
                  </p>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dosage</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedDrug.dosage}</p>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Side Effects</h4>
                  <ul className="list-disc list-inside">
                    {selectedDrug.sideEffects.map((effect, i) => (
                      <li key={i} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{effect}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Contraindications</h4>
                  <ul className="list-disc list-inside">
                    {selectedDrug.contraindications.map((contra, i) => (
                      <li key={i} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{contra}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pregnancy Category</h4>
                  <Badge>{selectedDrug.pregnancyCategory}</Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Searchable Drug Select Component
function SearchableDrugSelect({ 
  value, 
  onChange, 
  placeholder, 
  darkMode 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
  darkMode: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // All available drugs from database + common interaction drugs
  const allDrugs = [
    ...DRUG_DATABASE.map(d => d.name),
    ...DRUG_DATABASE.map(d => d.genericName),
    'Warfarin', 'Aspirin', 'Contrast Dye', 'Lisinopril', 'Spironolactone', 
    'Simvastatin', 'Clarithromycin'
  ];
  const uniqueDrugs = [...new Set(allDrugs)].sort();

  const filteredDrugs = uniqueDrugs.filter(drug => 
    drug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <Input 
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchTerm(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
        />
        <Button 
          type="button"
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className={darkMode ? 'border-gray-600 text-gray-300' : ''}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border shadow-lg ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medications..."
              className={`mb-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              autoFocus
            />
          </div>
          <div className="py-1">
            {filteredDrugs.length === 0 ? (
              <div className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No medications found. Type to add custom.
              </div>
            ) : (
              filteredDrugs.map((drug) => (
                <button
                  key={drug}
                  onClick={() => {
                    onChange(drug);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-900 ${
                    value === drug ? 'bg-blue-100 dark:bg-blue-900' : ''
                  } ${darkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  {drug}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Interaction Checker Screen
function InteractionCheckerScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState<any>(null);

  const checkInteraction = () => {
    const interaction = INTERACTIONS.find(
      i => (i.drug1.toLowerCase() === drug1.toLowerCase() && i.drug2.toLowerCase() === drug2.toLowerCase()) ||
           (i.drug1.toLowerCase() === drug2.toLowerCase() && i.drug2.toLowerCase() === drug1.toLowerCase())
    );
    setResult(interaction || { severity: 'None', message: 'No known interaction found between these medications.' });
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Drug Interaction Checker
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Simplifying Prescriptions. Amplifying Health.
        </p>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className={darkMode ? 'text-gray-300' : ''}>Drug 1</Label>
              <SearchableDrugSelect
                value={drug1}
                onChange={setDrug1}
                placeholder="Select or type drug name"
                darkMode={darkMode}
              />
            </div>
            <div className="space-y-2">
              <Label className={darkMode ? 'text-gray-300' : ''}>Drug 2</Label>
              <SearchableDrugSelect
                value={drug2}
                onChange={setDrug2}
                placeholder="Select or type drug name"
                darkMode={darkMode}
              />
            </div>
            <Button onClick={checkInteraction} className="w-full bg-blue-600 hover:bg-blue-700">
              Check Interaction
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {result.severity === 'Major' ? <XCircle className="w-8 h-8 text-red-500" /> :
                 result.severity === 'Moderate' ? <AlertTriangle className="w-8 h-8 text-yellow-500" /> :
                 result.severity === 'Minor' ? <CheckCircle className="w-8 h-8 text-green-500" /> :
                 <CheckCircle className="w-8 h-8 text-green-500" />}
                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Severity: {result.severity}
                  </h3>
                </div>
              </div>
              {result.mechanism && (
                <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Mechanism:</strong> {result.mechanism}
                </p>
              )}
              {result.recommendation && (
                <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Recommendation:</strong> {result.recommendation}
                </p>
              )}
              {result.message && (
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{result.message}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Dose Calculator Screen
function DoseCalculatorScreen({ darkMode, onBack, patientProfile }: { darkMode: boolean; onBack: () => void; patientProfile: any }) {
  const [drug, setDrug] = useState('');
  const [weight, setWeight] = useState(patientProfile?.weight || '');
  const [result, setResult] = useState<string | null>(null);

  const calculateDose = () => {
    // Simplified dose calculation
    const baseDose = 10; // mg/kg
    const calculatedDose = parseFloat(weight) * baseDose;
    
    let adjustment = '';
    if (patientProfile?.kidneyFunction !== 'normal') {
      adjustment += ' Dose adjustment recommended for kidney impairment.';
    }
    if (patientProfile?.liverFunction !== 'normal') {
      adjustment += ' Dose adjustment recommended for liver impairment.';
    }
    
    setResult(`Recommended dose: ${calculatedDose}mg${adjustment}`);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Dose Calculator
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Simplifying Prescriptions. Amplifying Health.
        </p>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className={darkMode ? 'text-gray-300' : ''}>Drug Name</Label>
              <SearchableDrugSelect
                value={drug}
                onChange={setDrug}
                placeholder="Select or type drug name"
                darkMode={darkMode}
              />
            </div>
            <div className="space-y-2">
              <Label className={darkMode ? 'text-gray-300' : ''}>Patient Weight (kg)</Label>
              <Input 
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in kg"
                className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
            <Button onClick={calculateDose} className="w-full bg-blue-600 hover:bg-blue-700">
              Calculate Dose
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Calculation Result
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{result}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Timer Screen
function TimerScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [interval, setIntervalValue] = useState(8); // hours

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(interval * 3600); // convert hours to seconds
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Next Dose Timer
        </h2>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className={darkMode ? 'text-gray-300' : ''}>Interval (hours)</Label>
              <Select value={interval.toString()} onValueChange={(v) => setIntervalValue(parseInt(v))}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={`text-center py-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <p className={`text-6xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={startTimer} className="flex-1 bg-green-600 hover:bg-green-700">
                Start Timer
              </Button>
              <Button onClick={() => setIsRunning(false)} variant="outline" className="flex-1">
                Pause
              </Button>
              <Button onClick={() => { setIsRunning(false); setTimeLeft(0); }} variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Converter Screen
function ConverterScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mg');
  const [toUnit, setToUnit] = useState('g');
  const [result, setResult] = useState<string | null>(null);

  const weightUnits = ['mg', 'g', 'kg', 'mcg'];
  const volumeUnits = ['ml', 'tsp', 'tbsp', 'oz'];

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    // Simplified conversion logic
    const conversions: Record<string, Record<string, number>> = {
      mg: { g: 0.001, kg: 0.000001, mcg: 1000 },
      g: { mg: 1000, kg: 0.001, mcg: 1000000 },
      kg: { mg: 1000000, g: 1000, mcg: 1000000000 },
      mcg: { mg: 0.001, g: 0.000001, kg: 0.000000001 },
      ml: { tsp: 0.2, tbsp: 0.067, oz: 0.034 },
      tsp: { ml: 5, tbsp: 0.333, oz: 0.167 },
      tbsp: { ml: 15, tsp: 3, oz: 0.5 },
      oz: { ml: 29.57, tsp: 6, tbsp: 2 },
    };

    const converted = val * (conversions[fromUnit]?.[toUnit] || 1);
    setResult(`${val} ${fromUnit} = ${converted.toFixed(4)} ${toUnit}`);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Household Converter
        </h2>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className={darkMode ? 'text-gray-300' : ''}>Value</Label>
              <Input 
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>From</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...weightUnits, ...volumeUnits].map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>To</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...weightUnits, ...volumeUnits].map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={convert} className="w-full bg-blue-600 hover:bg-blue-700">
              Convert
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <p className={`text-xl text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>{result}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Administration Guide Screen
function AdminGuideScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState('food');

  const sections = [
    { id: 'food', label: 'Food Interactions', icon: Pill },
    { id: 'timing', label: 'Dosing Schedules', icon: Clock },
    { id: 'routes', label: 'Routes of Administration', icon: Syringe },
    { id: 'crushing', label: 'Crushing & Splitting', icon: Pill },
    { id: 'storage', label: 'Storage Guidelines', icon: Thermometer },
    { id: 'special', label: 'Special Populations', icon: Users },
    { id: 'adherence', label: 'Adherence Strategies', icon: ClipboardList },
    { id: 'safety', label: 'Medication Safety', icon: Shield },
  ];

  const foodInteractions = [
    { category: 'Take WITH Food', drugs: ['NSAIDs (ibuprofen, naproxen, aspirin)', 'Metformin', 'Corticosteroids (prednisone)', 'Iron supplements', 'Potassium supplements', 'Gabapentin'], reason: 'Reduces GI irritation, improves tolerability, and decreases nausea. Food can increase absorption of some drugs like gabapentin.' },
    { category: 'Take on EMPTY Stomach', drugs: ['Levothyroxine (Synthroid)', 'Bisphosphonates (alendronate, risedronate)', 'Penicillin antibiotics', 'Azithromycin', 'Ampicillin', 'Tetracyclines', 'Sucralfate'], reason: 'Better absorption; food may decrease bioavailability by 30-50%. Take 30-60 minutes before or 2 hours after meals.' },
    { category: 'AVOID Grapefruit', drugs: ['Statins (simvastatin, atorvastatin, lovastatin)', 'Calcium channel blockers (felodipine, nifedipine)', 'Immunosuppressants (cyclosporine, tacrolimus)', 'Antiarrhythmics (amiodarone)', 'Carbamazepine', 'Buspirone'], reason: 'CYP3A4 inhibition can increase drug levels 2-15 fold. Effect can last 24-72 hours after grapefruit consumption.' },
    { category: 'AVOID Dairy/Antacids', drugs: ['Fluoroquinolones (ciprofloxacin, levofloxacin)', 'Tetracyclines (doxycycline, minocycline)', 'Bisphosphonates (alendronate)', 'Levothyroxine', 'Iron supplements (when taking other meds)'], reason: 'Calcium, magnesium, iron, aluminum form insoluble complexes. Separate by at least 2-4 hours.' },
    { category: 'High-Fiber Warning', drugs: ['Digoxin', 'Warfarin', 'Lithium', 'Anticonvulsants (phenytoin, carbamazepine)'], reason: 'Fiber may decrease absorption by binding drugs. Maintain consistent fiber intake; do not suddenly increase or decrease.' },
    { category: 'Vitamin K Interactions', drugs: ['Warfarin (Coumadin)'], reason: 'Vitamin K-rich foods (leafy greens, broccoli) can reduce warfarin effect. Maintain consistent vitamin K intake rather than avoiding.' },
    { category: 'Tyramine Restrictions', drugs: ['MAO inhibitors (phenelzine, tranylcypromine)'], reason: 'Tyramine-rich foods (aged cheese, cured meats, wine) can cause hypertensive crisis. Requires strict dietary restrictions.' },
    { category: 'Alcohol Interactions', drugs: ['Metronidazole, Disulfiram, Cefotetan, Ketoconazole'], reason: 'Disulfiram-like reaction: severe nausea, vomiting, flushing, headache. Avoid alcohol during and for 48-72 hours after.' },
  ];

  const timingGuidelines = [
    { schedule: 'Once Daily (QD)', bestTime: 'Morning or as directed', examples: ['Levothyroxine (AM, empty stomach, 30 min before breakfast)', 'Statins (evening for most - cholesterol synthesis peaks at night)', 'ACE inhibitors (morning)', 'SSRIs (morning to avoid insomnia)'] },
    { schedule: 'Twice Daily (BID)', bestTime: 'Every 12 hours', examples: ['Metformin (with meals)', 'Amoxicillin (every 12 hours)', 'Doxycycline (every 12 hours)', 'Metoprolol (every 12 hours)'] },
    { schedule: 'Three Times Daily (TID)', bestTime: 'Every 8 hours', examples: ['Penicillin VK (every 8 hours)', 'Gabapentin (every 8 hours)', 'Many antibiotics', 'Carbamazepine'] },
    { schedule: 'Four Times Daily (QID)', bestTime: 'Every 6 hours', examples: ['Theophylline', 'Some antibiotics', 'Rheumatoid arthritis medications'] },
    { schedule: 'Before Meals (AC)', bestTime: '30-60 minutes before', examples: ['Insulin (rapid-acting)', 'Metoclopramide', 'Some diabetes medications', 'Sucralfate'] },
    { schedule: 'After Meals (PC)', bestTime: 'Within 30 minutes after', examples: ['NSAIDs (ibuprofen, naproxen)', 'Proton pump inhibitors', 'Iron supplements', 'Potassium supplements'] },
    { schedule: 'At Bedtime (HS)', bestTime: 'Before sleep', examples: ['Statins (simvastatin)', 'Sedatives (zolpidem)', 'Melatonin', 'Some antihistamines'] },
    { schedule: 'On an Empty Stomach', bestTime: '1 hour before or 2 hours after meals', examples: ['Levothyroxine', 'Bisphosphonates', 'Sucralfate', 'Most antibiotics'] },
  ];

  const routeGuidelines = [
    { route: 'Oral (PO)', instructions: 'Swallow whole with full glass of water unless directed otherwise. Do not lie down for 30 minutes after. Remain upright for bisphosphonates.', specialNotes: 'Most common route; affected by food, GI motility, first-pass metabolism. Some medications require acidic environment (ketoconazole) while others need alkaline (fluoroquinolones).' },
    { route: 'Sublingual (SL)', instructions: 'Place under tongue until fully dissolved. Do not swallow, eat, or drink until dissolved. Avoid smoking before administration.', specialNotes: 'Bypasses first-pass metabolism (nitroglycerin, buprenorphine). Rapid onset (1-5 minutes for nitroglycerin). Do not chew or swallow.' },
    { route: 'Buccal', instructions: 'Place between gum and cheek until dissolved. Alternate sides of mouth with each dose. Do not chew or swallow.', specialNotes: 'Similar to sublingual; used for hormones (testosterone) and some pain medications (fentanyl buccal). Less affected by eating/drinking than sublingual.' },
    { route: 'Rectal (PR)', instructions: 'Insert past sphincter muscle (suppositories) or apply thin film (creams). Remain lying down 15-30 minutes if possible. Refrigerate suppositories if too soft.', specialNotes: 'Useful for vomiting patients, seizures (diastat), or when oral route contraindicated. Partially bypasses first-pass metabolism. Can cause local irritation.' },
    { route: 'Transdermal', instructions: 'Apply to clean, dry, hairless skin. Rotate application sites weekly. Press firmly for 10-15 seconds. Do not cut patches. Remove old patch before applying new.', specialNotes: 'Provides steady drug levels; patches should not be cut (fentanyl, nitroglycerin). Avoid heat sources (heating pads, hot tubs) which increase absorption.' },
    { route: 'Inhalation', instructions: 'Shake well (MDIs), exhale fully, inhale deeply while activating, hold breath 10 seconds. Rinse mouth after corticosteroids.', specialNotes: 'Use spacer for MDIs to improve deposition. Dry powder inhalers require rapid, forceful inhalation. Nebulizers for acute bronchospasm or patients unable to use MDIs.' },
    { route: 'Ophthalmic', instructions: 'Tilt head back, pull down lower lid, instill drop without touching eye, close eye 1-2 minutes. Press inner corner (punctal occlusion) for 1-2 minutes.', specialNotes: 'Press inner corner (punctal occlusion) to reduce systemic absorption. Wait 5-10 minutes between different eye drops. Discard opened bottles after 28-30 days.' },
    { route: 'Otic', instructions: 'Warm drops in hands first. Lie on side with affected ear up for 5 minutes. Pull ear down and back (children) or up and back (adults) to straighten canal.', specialNotes: 'Do not use if ear drum perforated unless directed (some suspensions are safe). Do not insert cotton swabs into ear canal.' },
    { route: 'Nasal', instructions: 'Clear nose first. Aim spray away from septum (toward outer wall of nostril). Do not share devices. Prime pump before first use.', specialNotes: 'Local corticosteroids may take days to weeks for full effect. Decongestant sprays should not be used >3 days to avoid rebound congestion.' },
    { route: 'Subcutaneous (SC)', instructions: 'Pinch skin, insert at 45-90° angle (90° for most), do not aspirate. Rotate sites (abdomen, thigh, upper arm).', specialNotes: 'Insulin, heparin, vaccines, biologics. Absorption varies by site (abdomen fastest, thigh slowest). Do not inject into areas of lipohypertrophy.' },
    { route: 'Intramuscular (IM)', instructions: 'Insert at 90° angle into muscle. Aspirate before injecting (some medications). Use appropriate needle length (1-1.5 inches for adults).', specialNotes: 'Deltoid (1mL max), vastus lateralis, ventrogluteal (preferred for large volumes). Avoid sciatic nerve injury. Z-track technique for irritating medications.' },
    { route: 'Intravenous (IV)', instructions: 'Verify compatibility, check for precipitates, use appropriate infusion rate, monitor for extravasation.', specialNotes: 'Direct IV push, intermittent infusion, or continuous infusion. Some drugs require filters, light protection, or specific diluents.' },
  ];

  const crushingGuidelines = [
    { type: 'NEVER Crush - Extended Release', examples: ['Extended-release (ER, XR, XL)', 'Sustained-release (SR)', 'Controlled-release (CR)', 'Long-acting (LA)'], reason: 'Can cause immediate release of entire dose leading to toxicity. Look for abbreviations in drug name.' },
    { type: 'NEVER Crush - Enteric Coated', examples: ['Enteric-coated tablets (EC)', 'Delayed-release (DR)', 'Aspirin EC', 'Diclofenac EC'], reason: 'Destroys protective coating causing gastric irritation or drug degradation by stomach acid.' },
    { type: 'NEVER Crush - Special Formulations', examples: ['Sublingual/buccal tablets', 'Chemotherapy drugs', 'Hormonal therapies', 'Capsules with pellets/beads', 'Fentanyl patches'], reason: 'Can cause toxicity, reduced efficacy, or harm to handler. Some are designed for specific release patterns.' },
    { type: 'Usually Safe to Crush', examples: ['Most immediate-release tablets', 'Some scored tablets (along score line)', 'Non-enteric coated tablets'], reason: 'Check specific product; some IR tablets have special coatings. Verify with pharmacist if uncertain.' },
    { type: 'Alternative Options for Dysphagia', examples: ['Liquid formulations (suspensions, solutions)', 'Orally disintegrating tablets (ODT)', 'Transdermal patches', 'Suppositories', 'Subcutaneous injections'], reason: 'For patients with dysphagia; consult pharmacist for availability. Some drugs can be compounded into liquids.' },
  ];

  const storageGuidelines = [
    { condition: 'Room Temperature (15-30°C / 59-86°F)', medications: ['Most oral medications', 'Inhalers', 'Topical creams', 'Most tablets and capsules'], warnings: 'Avoid heat sources, direct sunlight, humidity. Do not store above bathroom sinks or in kitchen cabinets near stove.' },
    { condition: 'Refrigerate (2-8°C / 36-46°F)', medications: ['Insulin (unopened)', 'Some antibiotics (amoxicillin suspension)', 'Vaccines', 'Certain eye drops (latanoprost)', 'Biologics (etanercept, adalimumab, insulin)'], warnings: 'Do not freeze; allow to reach room temperature before use. Do not store in door (temperature fluctuates).' },
    { condition: 'Protect from Light', medications: ['Nitroglycerin tablets', 'Multivitamins', 'Certain antibiotics (doxycycline)', 'Chemotherapy drugs', 'Epinephrine'], warnings: 'Store in original amber containers. Do not transfer to pill organizers if light-sensitive.' },
    { condition: 'Protect from Moisture', medications: ['Effervescent tablets', 'Powder medications', 'Test strips', 'Cefuroxime axetil'], warnings: 'Keep desiccant in container; do not store in bathroom. Keep container tightly closed.' },
    { condition: 'Controlled Room Temperature', medications: ['Suppositories', 'Certain suspensions', 'Some creams and ointments'], warnings: 'May require specific temperature range; check label. Suppositories may soften at room temperature.' },
    { condition: 'Freezer (-20°C)', medications: ['Some vaccines', 'Certain lab tests'], warnings: 'Do not refreeze once thawed. Use immediately after thawing.' },
  ];

  const specialPopulations = [
    { population: 'Pediatric (0-18 years)', considerations: ['Dosing by weight (mg/kg) or body surface area', 'Liquid formulations preferred', 'Flavoring may help compliance', 'Accurate measuring devices essential (oral syringes, not spoons)'], keyPoints: 'Check age-appropriate formulations; many adult doses not appropriate. Neonates have immature drug metabolism. Children are not small adults.' },
    { population: 'Geriatric (≥65 years)', considerations: ['Start low, go slow', 'Consider polypharmacy and drug interactions', 'Assess swallowing ability and cognition', 'Monitor for cognitive effects, falls, orthostatic hypotension'], keyPoints: 'Increased sensitivity to CNS drugs, hypotensives; fall risk. Decreased renal/hepatic function. Beers criteria for potentially inappropriate medications.' },
    { population: 'Pregnancy', considerations: ['FDA pregnancy categories (A, B, C, D, X)', 'Teratogenic risk assessment by trimester', 'Benefit vs risk analysis', 'Lactation compatibility (L1-L5)'], keyPoints: 'First trimester is highest risk for teratogenicity. Some drugs safe in pregnancy (insulin, most antibiotics) while others contraindicated (ACE inhibitors, warfarin).' },
    { population: 'Renal Impairment', considerations: ['Dose adjustment required for renally cleared drugs', 'Nephrotoxic drug avoidance', 'Monitoring renal function (CrCl, eGFR)', 'Extended dosing intervals or reduced doses'], keyPoints: 'GFR-based dosing; many drugs require 25-75% dose reduction. Avoid NSAIDs, aminoglycosides, contrast dye. Adjust timing of dialysis medications.' },
    { population: 'Hepatic Impairment', considerations: ['Avoid hepatotoxic drugs', 'Monitor LFTs regularly', 'Consider Child-Pugh classification', 'Protein binding changes affect free drug levels'], keyPoints: 'First-pass metabolism affected; increased bioavailability of some drugs. Avoid acetaminophen >2g/day, alcohol. Dose adjustments for hepatically metabolized drugs.' },
    { population: 'Obesity', considerations: ['Weight-based dosing may need adjustment', 'Lipophilic drugs have larger volume of distribution', 'Therapeutic drug monitoring may be needed', 'Bariatric surgery affects drug absorption'], keyPoints: 'Use ideal body weight, adjusted body weight, or actual body weight depending on drug properties. Some drugs require higher doses.' },
  ];

  const adherenceStrategies = [
    { strategy: 'Simplification', description: 'Reduce regimen complexity', examples: ['Once-daily dosing when possible', 'Combination products', 'Long-acting formulations', 'Synchronize refill dates'] },
    { strategy: 'Reminder Systems', description: 'Use cues to remember doses', examples: ['Pill organizers', 'Smartphone alarms', 'Medication apps', 'Link to daily routines (meals, bedtime)'] },
    { strategy: 'Patient Education', description: 'Ensure understanding of medication purpose', examples: ['Explain what each medication does', 'Discuss consequences of non-adherence', 'Provide written instructions', 'Teach-back method'] },
    { strategy: 'Address Barriers', description: 'Identify and resolve adherence obstacles', examples: ['Cost assistance programs', 'Simplify packaging for dexterity issues', 'Flavoring for children', 'Home delivery for transportation issues'] },
    { strategy: 'Monitoring', description: 'Track adherence and follow up', examples: ['Pill counts', 'Pharmacy refill records', 'Therapeutic drug monitoring', 'Regular follow-up appointments'] },
  ];

  const safetyGuidelines = [
    { topic: 'Look-Alike/Sound-Alike (LASA) Drugs', recommendations: ['Store separately with warning labels', 'Double-check before dispensing', 'Use tall man lettering (e.g., hydrOXYzine, hydrALAzine)', 'Counsel patients on differences'], examples: ['Celexa vs Celebrex', 'Zyprexa vs Zyrtec', 'Hydralazine vs Hydroxyzine'] },
    { topic: 'High-Alert Medications', recommendations: ['Require independent double-check', 'Use standardized concentrations', 'Implement barcode verification', 'Patient education is essential'], examples: ['Insulin, anticoagulants, opioids', 'Chemotherapy, neuromuscular blockers', 'Concentrated electrolytes'] },
    { topic: 'Pediatric Safety', recommendations: ['Verify weight-based calculations', 'Use metric units only', 'Check maximum adult dose', 'Use appropriate measuring devices'], examples: ['Never use household spoons', 'Double-check decimal points', 'Verify age-appropriate formulation'] },
    { topic: 'Allergy Documentation', recommendations: ['Document reaction type and severity', 'Verify allergies at every encounter', 'Alert bracelets for severe allergies', 'Cross-sensitivity awareness'], examples: ['Sulfa allergy vs sulfite sensitivity', 'Penicillin allergy - true allergy vs intolerance', 'Contrast dye reactions'] },
    { topic: 'Pregnancy & Lactation', recommendations: ['Screen for pregnancy in women of childbearing age', 'Check pregnancy category', 'Consider teratogenic risk', 'Document lactation status'], examples: ['Category X drugs (absolute contraindication)', 'ACE inhibitors, warfarin, isotretinoin', 'Valproic acid - neural tube defects'] },
    { topic: 'Transitions of Care', recommendations: ['Medication reconciliation at admission/discharge', 'Verify home medications', 'Communicate changes to all providers', 'Patient education on changes'], examples: ['Hospital discharge medication list', 'Changes made during hospitalization', 'New allergies identified'] },
  ];

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Medication Administration Guide
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Comprehensive reference for safe and effective medication administration
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 ${activeSection === section.id ? 'bg-blue-600' : ''}`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        {activeSection === 'food' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Food-Drug Interactions</h3>
            {foodInteractions.map((item, idx) => (
              <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Drugs:</strong> {item.drugs.join(', ')}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Reason:</strong> {item.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'timing' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dosing Schedule Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {timingGuidelines.map((item, idx) => (
                <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.schedule}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Best Time:</strong> {item.bestTime}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Examples:</strong> {item.examples.join(', ')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'routes' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Routes of Administration</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {routeGuidelines.map((item, idx) => (
                <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.route}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Instructions:</strong> {item.instructions}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Notes:</strong> {item.specialNotes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'crushing' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Crushing and Splitting Guidelines</h3>
            {crushingGuidelines.map((item, idx) => (
              <Card key={idx} className={`${idx === 0 ? 'border-red-500' : ''} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`text-lg ${idx === 0 ? 'text-red-600' : (darkMode ? 'text-white' : 'text-gray-800')}`}>{item.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Examples:</strong> {item.examples.join(', ')}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Reason:</strong> {item.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'storage' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Storage Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {storageGuidelines.map((item, idx) => (
                <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.condition}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Medications:</strong> {item.medications.join(', ')}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Warnings:</strong> {item.warnings}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'special' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Special Populations</h3>
            {specialPopulations.map((item, idx) => (
              <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.population}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Considerations:</strong> {item.considerations.join('; ')}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Key Points:</strong> {item.keyPoints}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'adherence' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Medication Adherence Strategies</h3>
            {adherenceStrategies.map((item, idx) => (
              <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.strategy}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Description:</strong> {item.description}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Examples:</strong> {item.examples.join('; ')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'safety' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Medication Safety Guidelines</h3>
            {safetyGuidelines.map((item, idx) => (
              <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Recommendations:</strong> {item.recommendations.join('; ')}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Examples:</strong> {item.examples.join(', ')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Hazardous Drug Safety Screen
function HazardousScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Hazardous Drug Safety
        </h2>

        <div className="space-y-6">
          <Card className={`border-red-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                Personal Protective Equipment (PPE)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Wear disposable gloves when handling hazardous medications</li>
                <li>• Use protective gowns for chemotherapy drugs</li>
                <li>• Wear safety goggles if splashing is possible</li>
                <li>• Use N95 mask for powder handling</li>
              </ul>
            </CardContent>
          </Card>

          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>Disposal Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Return unused medications to pharmacy take-back programs</li>
                <li>• Do not flush medications unless specifically instructed</li>
                <li>• Mix with undesirable substance (coffee grounds, cat litter) before disposal</li>
                <li>• Remove personal information from containers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>Caregiver Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Wash hands before and after handling medications</li>
                <li>• Use separate utensils for crushing medications</li>
                <li>• Clean surfaces with disposable wipes</li>
                <li>• Pregnant women should avoid handling certain medications</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// My Medications Screen
function MyMedicationsScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
  const [showAdd, setShowAdd] = useState(false);

  const addMedication = () => {
    if (!newMed.name) return;
    const med: Medication = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      nextDose: new Date(Date.now() + 8 * 3600000)
    };
    setMedications([...medications, med]);
    setNewMed({ name: '', dosage: '', frequency: '' });
    setShowAdd(false);
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            My Medications
          </h2>
          <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Medication
          </Button>
        </div>

        {medications.length === 0 ? (
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardContent className="p-8 text-center">
              <Pill className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No medications added yet
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Click "Add Medication" to start tracking your prescriptions
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => (
              <Card key={med.id} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{med.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Dosage: {med.dosage} | Frequency: {med.frequency}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Next dose: {med.nextDose.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMedication(med.id)} className="text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={darkMode ? 'text-white' : 'text-gray-800'}>Add Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>Medication Name</Label>
                <Input 
                  value={newMed.name}
                  onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                  placeholder="e.g., Metformin"
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>Dosage</Label>
                <Input 
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                  placeholder="e.g., 500mg"
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-300' : ''}>Frequency</Label>
                <Input 
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                  placeholder="e.g., Twice daily"
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              <Button onClick={addMedication} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Minor Ailments Screen
function MinorAilmentsScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [selectedAilment, setSelectedAilment] = useState<typeof MINOR_AILMENTS[0] | null>(null);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Minor Ailments & Self-Care
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MINOR_AILMENTS.map((ailment) => (
            <Card 
              key={ailment.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
              onClick={() => setSelectedAilment(ailment)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <ailment.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{ailment.name}</h3>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {ailment.symptoms.slice(0, 2).join(', ')}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedAilment} onOpenChange={() => setSelectedAilment(null)}>
          <DialogContent className={`max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedAilment && (
                  <>
                    <selectedAilment.icon className="w-6 h-6 text-blue-600" />
                    {selectedAilment.name}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedAilment && (
              <div className="space-y-4">
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Symptoms</h4>
                  <ul className="list-disc list-inside">
                    {selectedAilment.symptoms.map((symptom, i) => (
                      <li key={i} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Self-Care Tips</h4>
                  <ul className="list-disc list-inside">
                    {selectedAilment.selfCare.map((tip, i) => (
                      <li key={i} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>OTC Options</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedAilment.otcOptions.join(', ')}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>When to See a Doctor</h4>
                  <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{selectedAilment.whenToSeeDoctor}</p>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Precautions</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedAilment.precautions}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Helper Components
function SidebarButton({ icon: Icon, label, onClick, sidebarOpen, darkMode, active }: { icon: any; label: string; onClick: () => void; sidebarOpen: boolean; darkMode: boolean; active?: boolean }) {
  return (
    <Button 
      variant="ghost" 
      className={`w-full justify-start ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : ''} ${darkMode ? 'text-gray-300 hover:bg-gray-700' : ''}`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-2" />
      {sidebarOpen && label}
    </Button>
  );
}

function StatCard({ title, value, icon: Icon, darkMode }: { title: string; value: string; icon: any; darkMode: boolean }) {
  return (
    <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAccessCard({ icon: Icon, title, onClick, darkMode }: { icon: any; title: string; onClick: () => void; darkMode: boolean }) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
      onClick={onClick}
    >
      <CardContent className="p-4 text-center">
        <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, description, onClick, darkMode, popular }: { icon: any; title: string; description: string; onClick: () => void; darkMode: boolean; popular?: boolean }) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-8 h-8 text-blue-600" />
          {popular && <Badge className="bg-green-500">Popular</Badge>}
        </div>
        <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      </CardContent>
    </Card>
  );
}

// Compounding Guide Screen
function CompoundingScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: 'Compounding Basics', icon: BookOpen },
    { id: 'calculations', label: 'Calculations', icon: Calculator },
    { id: 'stability', label: 'Stability Data', icon: Clock },
    { id: 'procedures', label: 'Procedures', icon: ClipboardList },
  ];

  const basicPrinciples = [
    { title: 'Definition', content: 'Compounding is the art and science of creating personalized medications by mixing individual ingredients to meet unique patient needs.' },
    { title: 'USP <795> - Non-Sterile', content: 'Guidelines for non-sterile preparations including quality assurance, personnel training, and environmental controls.' },
    { title: 'USP <797> - Sterile', content: 'Standards for sterile preparations including cleanroom requirements, beyond-use dating, and quality testing.' },
    { title: 'USP <800> - Hazardous Drugs', content: 'Requirements for handling hazardous drugs including engineering controls, PPE, and deactivation/decontamination.' },
  ];

  const commonCalculations = [
    { formula: 'Alligation', description: 'Method for mixing two preparations of different strengths to produce intermediate strength', example: 'Mix 20% and 5% to make 10% solution' },
    { formula: 'Percentage Strength', description: 'Expressing concentration as parts per hundred', example: '1% = 1g/100mL or 1g/100g' },
    { formula: 'Ratio Strength', description: 'Expressing concentration as a ratio', example: '1:1000 = 1g/1000mL = 0.1%' },
    { formula: 'Molarity (M)', description: 'Moles of solute per liter of solution', example: '1M NaCl = 58.44g/L' },
    { formula: 'Molality (m)', description: 'Moles of solute per kilogram of solvent', example: 'Used for freezing point depression calculations' },
    { formula: 'Osmolarity', description: 'Total concentration of osmotically active particles', example: 'Normal plasma: 275-295 mOsm/L' },
  ];

  const stabilityData = [
    { preparation: 'Omeprazole Suspension', beyondUse: '30 days refrigerated', storage: '2-8°C, protect from light', notes: 'Refrigeration essential for stability' },
    { preparation: 'Lansoprazole Suspension', beyondUse: '28 days refrigerated', storage: '2-8°C', notes: 'Stable in simple syrup' },
    { preparation: 'Metronidazole Suspension', beyondUse: '60 days room temp', storage: '15-30°C', notes: 'Good stability in Ora-Sweet' },
    { preparation: 'Gabapentin Suspension', beyondUse: '56 days refrigerated', storage: '2-8°C', notes: 'Use Ora-Plus/Ora-Sweet 1:1' },
    { preparation: 'Enalapril Solution', beyondUse: '30 days refrigerated', storage: '2-8°C', notes: 'Stable in simple syrup' },
    { preparation: 'Captopril Solution', beyondUse: '14 days refrigerated', storage: '2-8°C', notes: 'Very short stability' },
    { preparation: 'Spironolactone Suspension', beyondUse: '60 days room temp', storage: '15-30°C', notes: 'Good stability' },
    { preparation: 'Hydrocortisone Cream', beyondUse: '90 days room temp', storage: '15-30°C', notes: 'Stable in vanishing cream base' },
  ];

  const procedures = [
    { title: 'Weighing', steps: ['Calibrate balance daily', 'Use weighing paper or boat', 'Weigh by difference for powders', 'Record all weights immediately'] },
    { title: 'Measuring Liquids', steps: ['Use graduated cylinders for volumes >10mL', 'Use pipettes for volumes <10mL', 'Read at eye level at bottom of meniscus', 'Use proper technique for viscous liquids'] },
    { title: 'Trituration', steps: ['Reduce particle size in mortar', 'Add small amount of liquid (levigating agent)', 'Grind to smooth paste', 'Gradually add remaining vehicle'] },
    { title: 'Geometric Dilution', steps: ['Mix active ingredient with equal amount of diluent', 'Add mixture to equal amount of remaining diluent', 'Repeat until all diluent incorporated', 'Ensures uniform distribution'] },
  ];

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Compounding Guide
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Professional reference for pharmaceutical compounding
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === 'basics' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Compounding Basics</h3>
            {basicPrinciples.map((item, idx) => (
              <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'calculations' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Common Compounding Calculations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {commonCalculations.map((item, idx) => (
                <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.formula}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}><strong>Example:</strong> {item.example}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stability' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Beyond-Use Dating</h3>
            <div className="overflow-x-auto">
              <table className={`w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                    <th className="p-3 text-left">Preparation</th>
                    <th className="p-3 text-left">Beyond-Use Date</th>
                    <th className="p-3 text-left">Storage</th>
                    <th className="p-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {stabilityData.map((item, idx) => (
                    <tr key={idx} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-3">{item.preparation}</td>
                      <td className="p-3">{item.beyondUse}</td>
                      <td className="p-3">{item.storage}</td>
                      <td className="p-3">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'procedures' && (
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Compounding Procedures</h3>
            {procedures.map((item, idx) => (
              <Card key={idx} className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className={`list-decimal list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.steps.map((step, sidx) => (
                      <li key={sidx}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// TDM (Therapeutic Drug Monitoring) Screen
function TDMScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const tdmData = [
    { drug: 'Digoxin', therapeuticRange: '0.5-2.0 ng/mL', toxicLevel: '>2.5 ng/mL', sampleTime: 'At least 6-8 hours post-dose (steady state)', halfLife: '36-48 hours', keyConsiderations: 'Hypokalemia increases toxicity; check levels q3-6 months' },
    { drug: 'Lithium', therapeuticRange: '0.6-1.2 mEq/L (acute)', toxicLevel: '>1.5 mEq/L', sampleTime: '12 hours post-dose (trough)', halfLife: '18-24 hours', keyConsiderations: 'Dehydration, NSAIDs, ACE inhibitors increase levels' },
    { drug: 'Phenytoin', therapeuticRange: '10-20 mcg/mL', toxicLevel: '>20 mcg/mL', sampleTime: 'Trough, just before next dose', halfLife: 'Dose-dependent (22 hours at therapeutic)', keyConsiderations: 'Non-linear kinetics; small dose changes = large level changes' },
    { drug: 'Carbamazepine', therapeuticRange: '4-12 mcg/mL', toxicLevel: '>12 mcg/mL', sampleTime: 'Trough, just before next dose', halfLife: '12-17 hours', keyConsiderations: 'Auto-induction; levels decrease over first month' },
    { drug: 'Valproic Acid', therapeuticRange: '50-100 mcg/mL', toxicLevel: '>100 mcg/mL', sampleTime: 'Trough, just before next dose', halfLife: '9-16 hours', keyConsiderations: 'Highly protein bound; free fraction increases in renal/hepatic impairment' },
    { drug: 'Gentamicin', therapeuticRange: 'Peak: 5-10 mcg/mL, Trough: <2 mcg/mL', toxicLevel: 'Trough >2 mcg/mL', sampleTime: 'Peak: 30 min after infusion; Trough: just before next dose', halfLife: '2-3 hours', keyConsiderations: 'Nephrotoxic and ototoxic; extended interval dosing preferred' },
    { drug: 'Vancomycin', therapeuticRange: 'AUC/MIC 400-600 or Trough: 10-20 mcg/mL', toxicLevel: 'Trough >20 mcg/mL', sampleTime: 'Trough: just before 4th dose (steady state)', halfLife: '4-6 hours', keyConsiderations: 'Nephrotoxic; levels needed for prolonged therapy or renal impairment' },
    { drug: 'Theophylline', therapeuticRange: '5-15 mcg/mL', toxicLevel: '>20 mcg/mL', sampleTime: 'Trough, just before next dose', halfLife: '8 hours (smokers), 12 hours (non-smokers)', keyConsiderations: 'Many drug interactions; smoking decreases levels' },
    { drug: 'Cyclosporine', therapeuticRange: '100-400 ng/mL (varies by organ)', toxicLevel: '>400 ng/mL', sampleTime: 'Trough (C0) or 2-hour post-dose (C2)', halfLife: '8-12 hours', keyConsiderations: 'Nephrotoxic; many drug interactions; whole blood sample required' },
    { drug: 'Tacrolimus', therapeuticRange: '5-20 ng/mL (varies by organ/time)', toxicLevel: '>20 ng/mL', sampleTime: 'Trough, just before next dose', halfLife: '12-24 hours', keyConsiderations: 'Nephrotoxic and neurotoxic; whole blood sample required' },
    { drug: 'Methotrexate', therapeuticRange: 'Varies by indication', toxicLevel: '>0.1 mcmol/L at 48h (high-dose)', sampleTime: 'Serial levels after high-dose therapy', halfLife: '3-10 hours', keyConsiderations: 'Leucovorin rescue required for high-dose; monitor renal function' },
    { drug: 'Warfarin', therapeuticRange: 'INR 2.0-3.0 (most indications)', toxicLevel: 'INR >4.0', sampleTime: 'Any time (steady state)', halfLife: '20-60 hours', keyConsiderations: 'Many drug and food interactions; genetic factors affect dosing' },
  ];

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Therapeutic Drug Monitoring (TDM)
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Reference ranges, sampling times, and clinical considerations for monitored medications
        </p>

        <div className="overflow-x-auto">
          <table className={`w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <thead>
              <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <th className="p-3 text-left">Drug</th>
                <th className="p-3 text-left">Therapeutic Range</th>
                <th className="p-3 text-left">Toxic Level</th>
                <th className="p-3 text-left">Sample Time</th>
                <th className="p-3 text-left">Half-life</th>
                <th className="p-3 text-left">Key Considerations</th>
              </tr>
            </thead>
            <tbody>
              {tdmData.map((item, idx) => (
                <tr key={idx} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="p-3 font-medium">{item.drug}</td>
                  <td className="p-3">{item.therapeuticRange}</td>
                  <td className="p-3 text-red-500">{item.toxicLevel}</td>
                  <td className="p-3">{item.sampleTime}</td>
                  <td className="p-3">{item.halfLife}</td>
                  <td className="p-3">{item.keyConsiderations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>General TDM Guidelines</h4>
          <ul className={`space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            <li>• Draw trough levels just before the next scheduled dose (at steady state)</li>
            <li>• Steady state is typically reached after 5 half-lives</li>
            <li>• Document sample time relative to dose administration</li>
            <li>• Consider clinical context when interpreting levels</li>
            <li>• Repeat levels when changing doses or adding interacting medications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Clinical Calculators Screen
function ClinicalCalculatorsScreen({ darkMode, onBack }: { darkMode: boolean; onBack: () => void }) {
  const [activeCalc, setActiveCalc] = useState('crcl');
  
  // CrCl Calculator State
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState('male');
  const [crclResult, setCrclResult] = useState<number | null>(null);

  // BMI Calculator State
  const [height, setHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // BSA Calculator State
  const [bsaWeight, setBsaWeight] = useState('');
  const [bsaHeight, setBsaHeight] = useState('');
  const [bsaResult, setBsaResult] = useState<number | null>(null);

  // CHA2DS2-VASc State
  const [chf, setChf] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [age75, setAge75] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [vascular, setVascular] = useState(false);
  const [age65, setAge65] = useState(false);
  const [female, setFemale] = useState(false);
  const [cha2ds2Result, setCha2ds2Result] = useState<number | null>(null);

  const calculateCrCl = () => {
    const w = parseFloat(weight);
    const cr = parseFloat(creatinine);
    const a = parseFloat(age);
    if (w && cr && a) {
      let crcl = ((140 - a) * w) / (72 * cr);
      if (gender === 'female') crcl *= 0.85;
      setCrclResult(Math.round(crcl * 10) / 10);
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // convert cm to m
    const w = parseFloat(bmiWeight);
    if (h && w) {
      setBmiResult(Math.round((w / (h * h)) * 10) / 10);
    }
  };

  const calculateBSA = () => {
    const h = parseFloat(bsaHeight);
    const w = parseFloat(bsaWeight);
    if (h && w) {
      // Mosteller formula
      const bsa = Math.sqrt((h * w) / 3600);
      setBsaResult(Math.round(bsa * 100) / 100);
    }
  };

  const calculateCHA2DS2 = () => {
    let score = 0;
    if (chf) score += 1;
    if (hypertension) score += 1;
    if (age75) score += 2;
    if (diabetes) score += 1;
    if (stroke) score += 2;
    if (vascular) score += 1;
    if (age65) score += 1;
    if (female) score += 1;
    setCha2ds2Result(score);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getCrClStage = (crcl: number) => {
    if (crcl >= 90) return 'Normal (G1)';
    if (crcl >= 60) return 'Mild (G2)';
    if (crcl >= 30) return 'Moderate (G3)';
    if (crcl >= 15) return 'Severe (G4)';
    return 'Kidney Failure (G5)';
  };

  const getCHA2DS2Risk = (score: number) => {
    if (score === 0) return 'Low risk (0%/year)';
    if (score === 1) return 'Low-moderate (1.3%/year)';
    if (score === 2) return 'Moderate (2.2%/year)';
    if (score === 3) return 'High (3.2%/year)';
    if (score === 4) return 'High (4.0%/year)';
    if (score === 5) return 'High (6.7%/year)';
    return 'Very High (9.8%/year)';
  };

  const calculators = [
    { id: 'crcl', label: 'Creatinine Clearance', icon: Activity },
    { id: 'bmi', label: 'BMI Calculator', icon: Scale },
    { id: 'bsa', label: 'Body Surface Area', icon: TrendingUp },
    { id: 'cha2ds2', label: 'CHA₂DS₂-VASc Score', icon: Brain },
  ];

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Clinical Calculators
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Essential clinical calculations for pharmacy practice
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {calculators.map((calc) => (
            <Button
              key={calc.id}
              variant={activeCalc === calc.id ? 'default' : 'outline'}
              onClick={() => setActiveCalc(calc.id)}
              className={`flex items-center gap-2 ${activeCalc === calc.id ? 'bg-blue-600' : ''}`}
            >
              <calc.icon className="w-4 h-4" />
              {calc.label}
            </Button>
          ))}
        </div>

        {activeCalc === 'crcl' && (
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>Creatinine Clearance (Cockcroft-Gault)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Age (years)</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Serum Creatinine (mg/dL)</Label>
                  <Input type="number" step="0.1" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={calculateCrCl} className="w-full bg-blue-600 hover:bg-blue-700">Calculate CrCl</Button>
              {crclResult !== null && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{crclResult} mL/min</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{getCrClStage(crclResult)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeCalc === 'bmi' && (
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>Body Mass Index (BMI)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Weight (kg)</Label>
                  <Input type="number" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
              </div>
              <Button onClick={calculateBMI} className="w-full bg-blue-600 hover:bg-blue-700">Calculate BMI</Button>
              {bmiResult !== null && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bmiResult} kg/m²</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{getBMICategory(bmiResult)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeCalc === 'bsa' && (
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>Body Surface Area (Mosteller)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Height (cm)</Label>
                  <Input type="number" value={bsaHeight} onChange={(e) => setBsaHeight(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Weight (kg)</Label>
                  <Input type="number" value={bsaWeight} onChange={(e) => setBsaWeight(e.target.value)} className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} />
                </div>
              </div>
              <Button onClick={calculateBSA} className="w-full bg-blue-600 hover:bg-blue-700">Calculate BSA</Button>
              {bsaResult !== null && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bsaResult} m²</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeCalc === 'cha2ds2' && (
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>CHA₂DS₂-VASc Score (Stroke Risk)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Congestive Heart Failure (+1)</Label>
                  <input type="checkbox" checked={chf} onChange={(e) => setChf(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Hypertension (+1)</Label>
                  <input type="checkbox" checked={hypertension} onChange={(e) => setHypertension(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Age ≥75 years (+2)</Label>
                  <input type="checkbox" checked={age75} onChange={(e) => setAge75(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Diabetes Mellitus (+1)</Label>
                  <input type="checkbox" checked={diabetes} onChange={(e) => setDiabetes(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Prior Stroke/TIA/Thromboembolism (+2)</Label>
                  <input type="checkbox" checked={stroke} onChange={(e) => setStroke(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Vascular Disease (+1)</Label>
                  <input type="checkbox" checked={vascular} onChange={(e) => setVascular(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Age 65-74 years (+1)</Label>
                  <input type="checkbox" checked={age65} onChange={(e) => setAge65(e.target.checked)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Female (+1)</Label>
                  <input type="checkbox" checked={female} onChange={(e) => setFemale(e.target.checked)} className="w-5 h-5" />
                </div>
              </div>
              <Button onClick={calculateCHA2DS2} className="w-full bg-blue-600 hover:bg-blue-700">Calculate Score</Button>
              {cha2ds2Result !== null && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Score: {cha2ds2Result}</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{getCHA2DS2Risk(cha2ds2Result)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
