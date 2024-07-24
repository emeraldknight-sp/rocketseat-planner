import { ConfirmTripModal } from "./confirm-trip-modal";
import { DateRange } from "react-day-picker";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { FormEvent, useState } from "react";
import { InviteGuestsModal } from "./invite-guests-modal";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CreateTripPage() {
  const navigate = useNavigate();

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [emailsToInvite, setEmailsToInvite] = useState([
    "contato.davidalmeida@outlook.com",
  ]);

  const [destination, setDestination] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();

  const openGuestsInput = () => {
    setIsGuestsInputOpen(true);
  };

  const closeGuestsInput = () => {
    setIsGuestsInputOpen(false);
  };

  const openGuestsModal = () => {
    setIsGuestsModalOpen(true);
  };

  const closeGuestsModal = () => {
    setIsGuestsModalOpen(false);
  };

  const openConfirmTripModal = () => {
    setIsConfirmTripModalOpen(true);
  };

  const closeConfirmTripModal = () => {
    setIsConfirmTripModalOpen(false);
  };

  const addNewEmailToInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) {
      return;
    }

    if (emailsToInvite.includes(email)) {
      return;
    }

    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  };

  const removeEmailFromInvites = (emailToRemove: string) => {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove
    );

    setEmailsToInvite(newEmailList);
  };

  const createTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const toastStyle = {
      color: "#1a2e05",
      backgroundColor: "#a3e635",
      border: "0",
    };

    if (!destination) {
      toast.error("Sem destino!", {
        id: "without-destination",
        style: toastStyle,
      });
      return;
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      toast.error("Sem data de início e término!", {
        id: "without-event-start-and-end-dates",
        style: toastStyle,
      });
      return;
    }

    if (emailsToInvite.length === 0) {
      toast.error("Sem convidados selecionados!", {
        id: "without-emails-to-invite",
        style: toastStyle,
      });
      return;
    }

    if (!ownerName || !ownerEmail) {
      toast.error("Informe seus dados", {
        id: "without-owner-data",
        style: toastStyle,
      });
      return;
    }

    try {
      const res = await api.post("/trips", {
        destination,
        starts_at: eventStartAndEndDates.from,
        ends_at: eventStartAndEndDates.to,
        emails_to_invite: emailsToInvite,
        owner_name: ownerName,
        owner_email: ownerEmail,
      });

      const { tripId } = res.data;

      navigate(`/trips/${tripId}`);

      toast.success("Viagem criada!", {
        id: "created-trip",
        style: toastStyle,
      });
    } catch (error: any) {
      toast.error(error.message, {
        id: "error-create-trip",
        style: toastStyle,
      });

      console.error(`${error.message}: Verifique se a API está rodando!`);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>
        <div className="space-y-4">
          <DestinationAndDateStep
            isGuestsInputOpen={isGuestsInputOpen}
            closeGuestsInput={closeGuestsInput}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
          />
          {isGuestsInputOpen && (
            <InviteGuestsStep
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
              emailsToInvite={emailsToInvite}
            />
          )}
        </div>
        <p className="text-zinc-500 text-sm">
          Ao planejar sua viagem pela plann.er você automaticamente concorda{" "}
          <br /> com nossos{" "}
          <a href="#" className="text-zinc-300 underline">
            termos de uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-zinc-300 underline">
            políticas de privacidade
          </a>
          .
        </p>
      </div>
      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestsModal={closeGuestsModal}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}
      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          eventStartAndEndDates={eventStartAndEndDates}
          destination={destination}
        />
      )}
    </div>
  );
}
