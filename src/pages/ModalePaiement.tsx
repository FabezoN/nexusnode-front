import React, { useState } from "react";
import './ModalePaiement.css';
import { FetchPaiement } from "../class/paiements";
import { PostCommande } from "../class/commande";

interface ModalePaiementProps {
    onClose: () => void;
    onPaymentSuccess: (idAdresse: number) => void;
    idAdresse: number;
    idUser: number;
}

const ModalePaiement: React.FC<ModalePaiementProps> = ({ onClose, onPaymentSuccess, idAdresse,idUser }) => { // Ajouter idAdresse comme argument
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    console.log(idAdresse);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const etat = "Réussi";
            const paiementResponse = await FetchPaiement({ datePaiement: formattedDate, Etat: etat });
            if (paiementResponse && paiementResponse.idPaiement) {
                const idPaiement = paiementResponse.idPaiement;
                const nomfacture = "NomF";
                const CheminFacture = "CheminF";
                await PostCommande({ dateCommande: formattedDate, nomFacture: nomfacture, cheminFacture: CheminFacture, idPaiement: idPaiement, idAdresse: idAdresse, idUser: idUser });
                onClose();
                onPaymentSuccess(idAdresse);
            } else {
                throw new Error("La réponse de FetchPaiement est vide ou ne contient pas d'éléments.");
            }
        } catch (error) {
            console.error("Erreur lors du paiement:", error);
        }
    };

    return (
        <div className="modal2">
            <div className="modal2-content">
                <p>Adresse ajoutée</p>
                <h2>Paiement de la commande</h2>
                <form>
                    <div className="form-group">
                        <input type="number" placeholder="Numéro de carte" required className="input-formP" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="date" placeholder="Date d'expiration" required className="input-formP" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="CVV" required className="input-formP" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                    </div>
                    <button type="submit" onClick={handleSubmit}>Payer</button>
                    <button onClick={onClose}>Annuler</button>
                </form>
            </div>
        </div>
    );
};

export default ModalePaiement;
