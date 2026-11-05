"use client";

import { useCallback, useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import EmailMagicLinkForm from "@/components/EmailMagicLinkForm";
import { supabase } from "@/lib/supabase";
import { stockImages, valueChains } from "@/lib/site-data";

type ListingType = "supply" | "demand" | "service";
type ListingStatus = "active" | "paused" | "closed";
type VerificationStatus = "pending" | "verified" | "rejected";
type ActorType = "farmer" | "buyer" | "supplier";
type InterestStatus = "pending" | "accepted" | "declined" | "withdrawn";

type Listing = {
  id: string;
  created_at: string;
  actor_id: string;
  actor_type: ActorType;
  listing_type: ListingType;
  commodity: string | null;
  quantity: number | null;
  unit: string | null;
  price_indication: string | null;
  quality_grade: string | null;
  location_label: string | null;
  availability_start: string | null;
  availability_end: string | null;
  status: ListingStatus;
};

type ActorProfile = {
  actor_id: string;
  display_name: string;
  location_label: string | null;
  verification_status: VerificationStatus;
  actor_type: ActorType;
};

type Interest = {
  id: string;
  created_at: string;
  listing_id: string;
  responder_id: string;
  message: string | null;
  quantity_requested: number | null;
  status: InterestStatus;
};

type MyIdentity = {
  userId: string;
  actorType: ActorType;
  verificationStatus: VerificationStatus;
} | null;

function listingTypeLabel(t: ListingType) {
  return { supply: "Supply Offer", demand: "Buying Request", service: "Service Offer" }[t];
}

function listingTypeColor(t: ListingType) {
  return {
    supply: "bg-agri-green/10 text-agri-green",
    demand: "bg-harvest-gold/10 text-harvest-gold",
    service: "bg-forest/10 text-forest",
  }[t];
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    active: "bg-agri-green/15 text-agri-green",
    paused: "bg-harvest-gold/15 text-harvest-gold",
    closed: "bg-forest-dark/10 text-forest-dark/60",
    pending: "bg-harvest-gold/15 text-harvest-gold",
    accepted: "bg-agri-green/15 text-agri-green",
    declined: "bg-red-100 text-red-700",
    withdrawn: "bg-forest-dark/10 text-forest-dark/60",
  };
  return colors[status] ?? "bg-forest-dark/10 text-forest-dark/60";
}

export default function MarketplacePage() {
  const [authState, setAuthState] = useState<"checking" | "signedOut" | "signedIn">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [identity, setIdentity] = useState<MyIdentity>(null);
  const [identityChecked, setIdentityChecked] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [actorProfiles, setActorProfiles] = useState<Record<string, ActorProfile>>({});
  const [myInterestsSent, setMyInterestsSent] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(false);

  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [expressingFor, setExpressingFor] = useState<string | null>(null);
  const [expressing, setExpressing] = useState(false);
  const [expressError, setExpressError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<"all" | ListingType>("all");
  const [filterCommodity, setFilterCommodity] = useState<string>("all");

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setAuthState("signedOut");
      setIdentityChecked(true);
      return;
    }
    setEmail(data.session.user.email ?? null);
    await supabase.rpc("link_my_identity");
    setAuthState("signedIn");

    const userId = data.session.user.id;
    const [f, b, s] = await Promise.all([
      supabase.from("farmers").select("user_id, verification_status").eq("user_id", userId).maybeSingle(),
      supabase.from("buyers").select("user_id, verification_status").eq("user_id", userId).maybeSingle(),
      supabase.from("suppliers").select("user_id, verification_status").eq("user_id", userId).maybeSingle(),
    ]);
    if (f.data) {
      setIdentity({ userId, actorType: "farmer", verificationStatus: f.data.verification_status });
    } else if (b.data) {
      setIdentity({ userId, actorType: "buyer", verificationStatus: b.data.verification_status });
    } else if (s.data) {
      setIdentity({ userId, actorType: "supplier", verificationStatus: s.data.verification_status });
    } else {
      setIdentity(null);
    }
    setIdentityChecked(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async auth bootstrap on mount
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });
    return () => listener.subscription.unsubscribe();
  }, [checkSession]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: listingRows } = await supabase
      .from("listings")
      .select(
        "id, created_at, actor_id, actor_type, listing_type, commodity, quantity, unit, price_indication, quality_grade, location_label, availability_start, availability_end, status"
      )
      .order("created_at", { ascending: false })
      .limit(100);
    const loadedListings = (listingRows as Listing[]) ?? [];
    setListings(loadedListings);

    const actorIds = Array.from(new Set(loadedListings.map((l) => l.actor_id)));
    if (actorIds.length > 0) {
      const { data: profiles } = await supabase
        .from("v_listing_actor_profile")
        .select("actor_id, display_name, location_label, verification_status, actor_type")
        .in("actor_id", actorIds);
      const map: Record<string, ActorProfile> = {};
      ((profiles as ActorProfile[]) ?? []).forEach((p) => {
        map[p.actor_id] = p;
      });
      setActorProfiles(map);
    }

    const { data: sent } = await supabase
      .from("listing_interests")
      .select("id, created_at, listing_id, responder_id, message, quantity_requested, status")
      .order("created_at", { ascending: false });
    setMyInterestsSent((sent as Interest[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authState === "signedIn") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch once signed in
      loadData();
    }
  }, [authState, loadData]);

  // Split "my interests" into sent (I am the responder) vs. received (on
  // one of my own listings) now that identity and listings are known.
  const myListingIds = new Set(listings.filter((l) => l.actor_id === identity?.userId).map((l) => l.id));
  const sentByMe = myInterestsSent.filter((i) => i.responder_id === identity?.userId);
  const myInterestsReceived = myInterestsSent.filter((i) => myListingIds.has(i.listing_id));

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthState("signedOut");
    setListings([]);
    setIdentity(null);
  }

  async function handlePostListing(form: HTMLFormElement) {
    if (!identity) return;
    setPosting(true);
    setPostError(null);
    const fd = new FormData(form);
    const quantityRaw = String(fd.get("quantity") ?? "").trim();
    const { error } = await supabase.from("listings").insert({
      actor_id: identity.userId,
      actor_type: identity.actorType,
      listing_type: String(fd.get("listingType")),
      commodity: String(fd.get("commodity") ?? "") || null,
      quantity: quantityRaw ? Number(quantityRaw) : null,
      unit: String(fd.get("unit") ?? "") || null,
      price_indication: String(fd.get("priceIndication") ?? "") || null,
      quality_grade: String(fd.get("qualityGrade") ?? "") || null,
      location_label: String(fd.get("locationLabel") ?? "") || null,
    });
    setPosting(false);
    if (error) {
      setPostError(error.message);
      return;
    }
    setShowPostForm(false);
    loadData();
  }

  async function handleExpressInterest(form: HTMLFormElement, listingId: string) {
    if (!identity) return;
    setExpressing(true);
    setExpressError(null);
    const fd = new FormData(form);
    const qtyRaw = String(fd.get("quantityRequested") ?? "").trim();
    const { error } = await supabase.from("listing_interests").insert({
      listing_id: listingId,
      responder_id: identity.userId,
      message: String(fd.get("message") ?? "") || null,
      quantity_requested: qtyRaw ? Number(qtyRaw) : null,
    });
    setExpressing(false);
    if (error) {
      setExpressError(error.message);
      return;
    }
    setExpressingFor(null);
    loadData();
  }

  async function setListingStatus(id: string, status: ListingStatus) {
    await supabase.from("listings").update({ status }).eq("id", id);
    loadData();
  }

  async function respondToInterest(id: string, status: "accepted" | "declined") {
    await supabase.from("listing_interests").update({ status }).eq("id", id);
    loadData();
  }

  async function withdrawInterest(id: string) {
    await supabase.from("listing_interests").update({ status: "withdrawn" }).eq("id", id);
    loadData();
  }

  const canPost = identity?.verificationStatus === "verified";
  const browsableListings = listings.filter((l) => {
    if (filterType !== "all" && l.listing_type !== filterType) return false;
    if (filterCommodity !== "all" && l.commodity !== filterCommodity) return false;
    return true;
  });
  const myListings = listings.filter((l) => l.actor_id === identity?.userId);
  const otherListings = browsableListings.filter((l) => l.actor_id !== identity?.userId && l.status === "active");

  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="AgriXpert Marketplace"
        description="Browse supply offers, buying requests and service offers from verified farmers, buyers and suppliers, and express interest directly on the platform."
        image={stockImages.warehouseLogistics}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        {authState === "checking" && <p className="text-sm text-forest-dark/60">Checking sign-in status…</p>}

        {authState === "signedOut" && (
          <div className="max-w-xl">
            <p className="mb-6 text-forest-dark/70">
              Sign in with the email you registered on the{" "}
              <a href="/portal" className="font-semibold text-forest hover:text-forest-dark">
                Farmer / Buyer Portal
              </a>{" "}
              to browse and post marketplace listings.
            </p>
            <EmailMagicLinkForm redirectPath="/marketplace" buttonLabel="Sign In to Marketplace" />
          </div>
        )}

        {authState === "signedIn" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-white p-4">
              <p className="text-sm text-forest-dark/70">
                Signed in as <span className="font-semibold text-forest-dark">{email}</span>
              </p>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/5"
              >
                Sign Out
              </button>
            </div>

            {identityChecked && !identity && (
              <p className="mt-6 rounded-2xl border border-harvest-gold/20 bg-harvest-gold/5 p-5 text-sm text-forest-dark/70">
                No farmer, buyer or supplier registration is linked to this email, so there is nothing to
                post from yet. You can still browse below. Register via{" "}
                <a href="/for-farmers" className="font-semibold text-forest hover:text-forest-dark">
                  For Farmers
                </a>
                ,{" "}
                <a href="/for-buyers" className="font-semibold text-forest hover:text-forest-dark">
                  For Buyers
                </a>{" "}
                or{" "}
                <a href="/partnerships" className="font-semibold text-forest hover:text-forest-dark">
                  Partnerships
                </a>
                .
              </p>
            )}

            {identityChecked && identity && identity.verificationStatus !== "verified" && (
              <p className="mt-6 rounded-2xl border border-harvest-gold/20 bg-harvest-gold/5 p-5 text-sm text-forest-dark/70">
                Your registration is still pending verification. You can browse listings now; posting your
                own listing or expressing interest opens once an AgriXpert admin verifies your registration.
              </p>
            )}

            {/* Post a listing */}
            {canPost && (
              <div className="mt-6">
                {!showPostForm ? (
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark"
                  >
                    + Post a Listing
                  </button>
                ) : (
                  <PostListingForm
                    actorType={identity!.actorType}
                    posting={posting}
                    postError={postError}
                    onCancel={() => setShowPostForm(false)}
                    onSubmit={handlePostListing}
                  />
                )}
              </div>
            )}

            {/* My listings */}
            {identity && myListings.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-lg font-bold text-forest">My Listings</h2>
                <div className="mt-3 space-y-3">
                  {myListings.map((l) => (
                    <div key={l.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${listingTypeColor(l.listing_type)}`}>
                            {listingTypeLabel(l.listing_type)}
                          </span>
                          <p className="mt-2 font-semibold text-forest-dark">
                            {l.commodity ?? "—"}
                            {l.quantity ? ` · ${l.quantity}${l.unit ? ` ${l.unit}` : ""}` : ""}
                          </p>
                          <p className="text-xs text-forest-dark/60">
                            {l.price_indication ?? ""} {l.location_label ? `· ${l.location_label}` : ""}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(l.status)}`}>
                          {l.status}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {l.status === "active" ? (
                          <button
                            onClick={() => setListingStatus(l.id, "paused")}
                            className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                          >
                            Pause
                          </button>
                        ) : l.status === "paused" ? (
                          <button
                            onClick={() => setListingStatus(l.id, "active")}
                            className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                          >
                            Reactivate
                          </button>
                        ) : null}
                        {l.status !== "closed" && (
                          <button
                            onClick={() => setListingStatus(l.id, "closed")}
                            className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests received on my listings */}
            {identity && myInterestsReceived.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-lg font-bold text-forest">Interest Received</h2>
                <div className="mt-3 space-y-3">
                  {myInterestsReceived.map((i) => (
                    <div key={i.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-forest-dark/70">{i.message || "No message provided."}</p>
                          {i.quantity_requested != null && (
                            <p className="mt-1 text-xs text-forest-dark/60">Requested: {i.quantity_requested}</p>
                          )}
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(i.status)}`}>
                          {i.status}
                        </span>
                      </div>
                      {i.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => respondToInterest(i.id, "accepted")}
                            className="rounded-full bg-agri-green px-3 py-1.5 text-xs font-semibold text-natural-white hover:bg-agri-green/90"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => respondToInterest(i.id, "declined")}
                            className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests I've sent */}
            {identity && sentByMe.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-lg font-bold text-forest">Interest I&apos;ve Sent</h2>
                <div className="mt-3 space-y-3">
                  {sentByMe.map((i) => (
                    <div key={i.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="text-sm text-forest-dark/70">{i.message || "No message provided."}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(i.status)}`}>
                          {i.status}
                        </span>
                      </div>
                      {i.status === "pending" && (
                        <button
                          onClick={() => withdrawInterest(i.id)}
                          className="mt-3 rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Browse */}
            <div className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-heading text-lg font-bold text-forest">Browse Listings</h2>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as "all" | ListingType)}
                    className="rounded-lg border border-forest/20 px-3 py-1.5 text-xs"
                  >
                    <option value="all">All types</option>
                    <option value="supply">Supply Offers</option>
                    <option value="demand">Buying Requests</option>
                    <option value="service">Service Offers</option>
                  </select>
                  <select
                    value={filterCommodity}
                    onChange={(e) => setFilterCommodity(e.target.value)}
                    className="rounded-lg border border-forest/20 px-3 py-1.5 text-xs"
                  >
                    <option value="all">All commodities</option>
                    {valueChains.map((v) => (
                      <option key={v.slug} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading && <p className="mt-4 text-sm text-forest-dark/60">Loading listings…</p>}

              {!loading && otherListings.length === 0 && (
                <p className="mt-4 text-sm text-forest-dark/60">No matching listings yet.</p>
              )}

              <div className="mt-4 space-y-3">
                {!loading &&
                  otherListings.map((l) => {
                    const profile = actorProfiles[l.actor_id];
                    return (
                      <div key={l.id} className="rounded-2xl border border-forest/10 bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${listingTypeColor(l.listing_type)}`}>
                              {listingTypeLabel(l.listing_type)}
                            </span>
                            <p className="mt-2 font-semibold text-forest-dark">
                              {l.commodity ?? "—"}
                              {l.quantity ? ` · ${l.quantity}${l.unit ? ` ${l.unit}` : ""}` : ""}
                            </p>
                            <p className="text-xs text-forest-dark/60">
                              {l.price_indication ?? ""} {l.location_label ? `· ${l.location_label}` : ""}
                              {l.quality_grade ? ` · Grade: ${l.quality_grade}` : ""}
                            </p>
                            {profile && (
                              <p className="mt-2 text-xs font-medium text-forest-dark/70">
                                {profile.display_name}
                                {profile.verification_status === "verified" && (
                                  <span className="ml-1 text-agri-green">✓ Verified</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {identity?.verificationStatus === "verified" &&
                          (expressingFor === l.id ? (
                            <ExpressInterestForm
                              expressing={expressing}
                              expressError={expressError}
                              onCancel={() => setExpressingFor(null)}
                              onSubmit={(form) => handleExpressInterest(form, l.id)}
                            />
                          ) : (
                            <button
                              onClick={() => {
                                setExpressError(null);
                                setExpressingFor(l.id);
                              }}
                              className="mt-4 rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                            >
                              Express Interest
                            </button>
                          ))}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function PostListingForm({
  actorType,
  posting,
  postError,
  onCancel,
  onSubmit,
}: {
  actorType: ActorType;
  posting: boolean;
  postError: string | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  const defaultType: ListingType = actorType === "buyer" ? "demand" : actorType === "supplier" ? "service" : "supply";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="mt-2 space-y-4 rounded-2xl border border-forest/10 bg-white p-5"
    >
      <h3 className="font-heading text-base font-bold text-forest">New Listing</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark">Listing Type</label>
          <select name="listingType" defaultValue={defaultType} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm">
            <option value="supply">Supply Offer (I have commodity to sell)</option>
            <option value="demand">Buying Request (I want to buy commodity)</option>
            <option value="service">Service Offer (equipment, storage, logistics, etc.)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Commodity</label>
          <select name="commodity" defaultValue="" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm">
            <option value="">—</option>
            {valueChains.map((v) => (
              <option key={v.slug} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Quantity</label>
          <input name="quantity" type="number" min="0" step="0.1" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Unit</label>
          <input name="unit" placeholder="e.g. tonnes, bags" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Price Indication</label>
          <input name="priceIndication" placeholder="e.g. GHS 2,500/tonne" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Quality Grade</label>
          <input name="qualityGrade" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-forest-dark">Location</label>
          <input name="locationLabel" placeholder="e.g. Tamale, Northern Region" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
      </div>
      {postError && <p className="text-sm font-medium text-red-600">{postError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={posting}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
        >
          {posting ? "Posting…" : "Post Listing"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest-dark hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ExpressInterestForm({
  expressing,
  expressError,
  onCancel,
  onSubmit,
}: {
  expressing: boolean;
  expressError: string | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="mt-4 space-y-3 rounded-xl border border-forest/10 bg-forest/5 p-4"
    >
      <div>
        <label className="text-xs font-medium text-forest-dark">Quantity Requested (optional)</label>
        <input name="quantityRequested" type="number" min="0" step="0.1" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-forest-dark">Message</label>
        <textarea name="message" rows={2} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
      </div>
      {expressError && <p className="text-sm font-medium text-red-600">{expressError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={expressing}
          className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
        >
          {expressing ? "Sending…" : "Send Interest"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
