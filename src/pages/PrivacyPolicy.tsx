import { Link } from 'react-router-dom';
import legalCopy from '../content/legal.no.json';
import { LegalShell } from '../components/LegalShell';
import { openPrivacyChoices } from '../lib/consent';

export default function PrivacyPolicy() {
  const { common, privacy: copy } = legalCopy;
  const lastUpdatedLabel = common.lastUpdated.replace('{{date}}', copy.updated);
  const privacyEmail = common.privacyEmail;
  const personalDataItems = Object.values(copy.sections.personalData.items);
  const purposeItems = Object.values(copy.sections.purposes.items);
  const calendarItems = Object.values(copy.sections.calendars.items);
  const processors = Object.values(copy.sections.processors.items);
  const retentionItems = Object.values(copy.sections.retention.items);
  const rightsItems = Object.values(copy.sections.rights.items);

  return (
    <LegalShell
      path="/personvern"
      description="Les vår personvernerklæring for informasjon om hvordan Notably samler inn, bruker og beskytter dine personopplysninger."
      lastUpdatedLabel={lastUpdatedLabel}
      title={copy.title}
      intro={copy.intro}
      actions={
        <button
          type="button"
          onClick={openPrivacyChoices}
          className="rounded-full bg-[#2663eb] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Åpne Personvernvalg
        </button>
      }
    >
      <section>
        <h2>{copy.sections.controller.title}</h2>
        <p>{copy.sections.controller.body1}</p>
        <p>{copy.sections.controller.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.personalData.title}</h2>
        <p>{copy.sections.personalData.intro}</p>
        <ul>
          {personalDataItems.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.description}
            </li>
          ))}
        </ul>
        <p>{copy.sections.personalData.outro}</p>
      </section>

      <section>
        <h2>{copy.sections.purposes.title}</h2>
        <p>{copy.sections.purposes.intro}</p>
        <ul>
          {purposeItems.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.description}
            </li>
          ))}
        </ul>
        <p>{copy.sections.purposes.outro}</p>
      </section>

      <section>
        <h2>{copy.sections.sales.title}</h2>
        <p>{copy.sections.sales.body1}</p>
        <p>{copy.sections.sales.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.recording.title}</h2>
        <p>{copy.sections.recording.body1}</p>
        <p>{copy.sections.recording.body2}</p>
        <p>{copy.sections.recording.body3}</p>
      </section>

      <section>
        <h2>{copy.sections.calendars.title}</h2>
        <p>{copy.sections.calendars.intro}</p>
        <ul>
          {calendarItems.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.description}
            </li>
          ))}
        </ul>
        <p>
          {copy.sections.calendars.outro}{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            {copy.sections.calendars.policyLinkLabel}
          </a>
        </p>
      </section>

      <section>
        <h2>{copy.sections.connectedApps.title}</h2>
        <p>{copy.sections.connectedApps.body1}</p>
        <p>{copy.sections.connectedApps.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.processors.title}</h2>
        <p>{copy.sections.processors.intro}</p>
        <ul>
          {processors.map((processor) => (
            <li key={processor.name}>
              <strong>{processor.name}:</strong> {processor.purpose}
            </li>
          ))}
        </ul>
        <p>{copy.sections.processors.outro}</p>
      </section>

      <section>
        <h2>{copy.sections.transfers.title}</h2>
        <p>{copy.sections.transfers.body1}</p>
        <p>{copy.sections.transfers.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.dataResidency.title}</h2>
        <p>{copy.sections.dataResidency.body1}</p>
        <p>{copy.sections.dataResidency.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.cookies.title}</h2>
        <p>{copy.sections.cookies.body}</p>
        <p>{copy.sections.cookies.optionalTools}</p>
        <p>{copy.sections.cookies.measurement}</p>
        <p>{copy.sections.cookies.choices}</p>
        <p>{copy.sections.cookies.withdrawal}</p>
      </section>

      <section>
        <h2>{copy.sections.retention.title}</h2>
        <p>{copy.sections.retention.intro}</p>
        <ul>
          {retentionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{copy.sections.rights.title}</h2>
        <p>{copy.sections.rights.body1}</p>
        <ul>
          {rightsItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{copy.sections.rights.organization}</p>
        <p>
          {copy.sections.rights.body2Prefix}{' '}
          <Link to={`mailto:${privacyEmail}`}>{privacyEmail}</Link>
          {copy.sections.rights.body2Suffix}
        </p>
        <p>
          {copy.sections.rights.complaint}{' '}
          <a href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/klage-til-datatilsynet/">
            {copy.sections.rights.complaintLinkLabel}
          </a>
        </p>
      </section>

      <section>
        <h2>{copy.sections.children.title}</h2>
        <p>{copy.sections.children.body}</p>
      </section>

      <section>
        <h2>{copy.sections.changes.title}</h2>
        <p>{copy.sections.changes.body}</p>
      </section>
    </LegalShell>
  );
}
