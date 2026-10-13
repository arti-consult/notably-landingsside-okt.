import { Link } from 'react-router-dom';
import legalCopy from '../content/legal.no.json';
import { LegalShell } from '../components/LegalShell';

export default function TermsOfUse() {
  const { common, terms: copy } = legalCopy;
  const lastUpdatedLabel = common.lastUpdated.replace('{{date}}', copy.updated);
  const legalEmail = common.legalEmail;
  const acceptableUseItems = Object.values(copy.sections.acceptableUse.items);
  const connectedServiceItems = Object.values(copy.sections.connectedServices.items);

  return (
    <LegalShell
      path="/vilkar"
      description="Les våre vilkår for bruk for Notably. Denne siden beskriver rammer for bruk av tjenesten og ansvar mellom partene."
      lastUpdatedLabel={lastUpdatedLabel}
      title={copy.title}
      intro={copy.intro}
    >
      <section>
        <h2>{copy.sections.agreement.title}</h2>
        <p>{copy.sections.agreement.body1}</p>
        <p>{copy.sections.agreement.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.dataProcessingAgreement.title}</h2>
        <p>{copy.sections.dataProcessingAgreement.body1}</p>
        <p>{copy.sections.dataProcessingAgreement.body2}</p>
        <ul>
          <li>
            <a href="https://os.notably.no/vilkar/databehandleravtale">
              {copy.sections.dataProcessingAgreement.agreementLinkLabel}
            </a>
          </li>
          <li>
            <a href="https://os.notably.no/vilkar/underdatabehandlere">
              {copy.sections.dataProcessingAgreement.subprocessorsLinkLabel}
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>{copy.sections.service.title}</h2>
        <p>{copy.sections.service.body}</p>
      </section>

      <section>
        <h2>{copy.sections.accounts.title}</h2>
        <p>{copy.sections.accounts.body1}</p>
        <p>{copy.sections.accounts.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.recording.title}</h2>
        <p>{copy.sections.recording.body1}</p>
        <p>{copy.sections.recording.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.content.title}</h2>
        <p>{copy.sections.content.body1}</p>
        <p>{copy.sections.content.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.ai.title}</h2>
        <p>{copy.sections.ai.body1}</p>
        <p>{copy.sections.ai.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.acceptableUse.title}</h2>
        <p>{copy.sections.acceptableUse.intro}</p>
        <ul>
          {acceptableUseItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{copy.sections.dataResidency.title}</h2>
        <p>{copy.sections.dataResidency.body1}</p>
        <p>{copy.sections.dataResidency.body2}</p>
        <p>
          {copy.sections.dataResidency.linkPrefix}{' '}
          <Link to="/personvern">
            {copy.sections.dataResidency.linkLabel}
          </Link>
          {copy.sections.dataResidency.linkSuffix}
        </p>
      </section>

      <section>
        <h2>{copy.sections.connectedServices.title}</h2>
        <p>{copy.sections.connectedServices.intro}</p>
        <ul>
          {connectedServiceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{copy.sections.connectedServices.outro}</p>
      </section>

      <section>
        <h2>{copy.sections.billing.title}</h2>
        <p>{copy.sections.billing.body1}</p>
        <p>{copy.sections.billing.body2}</p>
        <p>{copy.sections.billing.body3}</p>
      </section>

      <section>
        <h2>{copy.sections.termination.title}</h2>
        <p>{copy.sections.termination.body1}</p>
        <p>{copy.sections.termination.body2}</p>
        <p>{copy.sections.termination.body3}</p>
      </section>

      <section>
        <h2>{copy.sections.availability.title}</h2>
        <p>{copy.sections.availability.body1}</p>
        <p>{copy.sections.availability.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.liability.title}</h2>
        <p>{copy.sections.liability.body1}</p>
        <p>{copy.sections.liability.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.general.title}</h2>
        <p>{copy.sections.general.body1}</p>
        <p>{copy.sections.general.body2}</p>
      </section>

      <section>
        <h2>{copy.sections.contact.title}</h2>
        <p>
          {copy.sections.contact.bodyPrefix} <Link to={`mailto:${legalEmail}`}>{legalEmail}</Link>
          {copy.sections.contact.bodySuffix}
        </p>
      </section>
    </LegalShell>
  );
}
