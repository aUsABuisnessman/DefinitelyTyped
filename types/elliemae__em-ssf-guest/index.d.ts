declare namespace ElliScript {
    interface Script {
        /**
         * Returns a reference to an object exposed by the application host.
         * For known objects, the return type is specified; otherwise, it returns a generic ProxyInstance.
         */
        getObject(objectId: "application"): Promise<ApplicationObject>;
        getObject(objectId: "auth"): Promise<AuthObject>;
        getObject(objectId: "http"): Promise<HttpObject>;
        getObject(objectId: "loan"): Promise<LoanObject>;
        getObject(objectId: "session"): Promise<SessionObject>;
        getObject(objectId: string): Promise<ProxyInstance>;

        /**
         * Registers a callback for an event generated by the specified object.
         */
        subscribe(
            objectId: string,
            eventName: string,
            callback: (event: any) => void,
        ): string | number;

        /**
         * Removes an event handler for a specific object's events.
         */
        unsubscribe(objectId: string, eventName: string, token: string | number): void;

        /**
         * Connects to the remoting system.
         */
        connect(guestWindowOrOptions?: any): void;

        /**
         * Deprecated method preserved for historical purposes.
         */
        ready(): void;

        /**
         * Sets the log level for the guest.
         */
        setLogLevel(level: number): void;

        /**
         * Exposes the log levels.
         */
        logLevels: LogLevels;

        /**
         * Class definitions.
         */
        Proxy: typeof ProxyClass;
        ProxyEvent: typeof ProxyEventClass;

        /**
         * Guest object for plugin frames.
         */
        guest: Guest;
    }

    interface LogLevels {
        Verbose: number;
        Trace: number;
        Info: number;
        Warning: number;
        Error: number;
        None: number;
    }

    class ProxyClass {
        constructor(objectId: string);
        id: string;

        /**
         * Adds an event listener for a specific event.
         */
        addEventListener(
            eventName: string,
            eventListener: (event: any) => void,
        ): string | number;

        /**
         * Removes an event listener.
         */
        removeEventListener(eventName: string, token: string | number): void;

        [methodName: string]: any;
    }

    interface ProxyInstance {
        id: string;
        addEventListener(
            eventName: string,
            eventListener: (event: any) => void,
        ): string | number;
        removeEventListener(eventName: string, token: string | number): void;
        [methodName: string]: any;
    }

    class ProxyEventClass {
        constructor(objectId: string, eventName: string);
        objectId: string;
        eventName: string;
        subscribe(callback: (event: any) => void): string | number;
        unsubscribe(token: string | number): void;
    }

    interface ProxyEventInstance {
        subscribe(callback: (event: any) => void): string | number;
        unsubscribe(token: string | number): void;
    }

    interface Guest {
        /**
         * Initializes the plugin frame and notifies the parent window.
         */
        create(scriptUri?: string, containerElement?: any): void;
    }

    /**
     * Application Object Interface
     */
    interface ApplicationObject {
        /**
         * Returns the current context of the application.
         */
        getApplicationContext(): Promise<ApplicationContext>;

        /**
         * Returns a descriptor for the Application.
         */
        getDescriptor(): Promise<ApplicationDescriptor>;

        /**
         * Navigates to Application/Loan routes using script.
         */
        navigate(navigateOptions: NavigateOptions): Promise<void>;

        /**
         * Performs a predefined action within the application.
         */
        performAction(actionName: string, actionOptions?: any): Promise<void>;

        /**
         * Opens a new browser tab to a target URL or logical page location.
         */
        open(openOptions: OpenOptions): Promise<void>;

        /**
         * Opens the specified location/resource in a modal window/dialog.
         */
        openModal(openOptions: OpenModalOptions): Promise<void>;

        /**
         * Returns a boolean indicating if a specified action is supported.
         */
        supportsAction(actionName: string): Promise<boolean>;

        /**
         * Returns a capabilities object that indicates what features/actions the application supports.
         */
        getCapabilities(): Promise<ApplicationCapabilities>;

        /**
         * Sends an event to parent application to refresh the current session.
         */
        keepSessionAlive(): Promise<void>;

        /**
         * Sends an event to parent application to close the current modal.
         */
        closeModal(): Promise<void>;

        /**
         * Opens a browser's print dialog with the content provided as a Blob object.
         */
        print(printOptions: PrintOptions): Promise<void>;

        /**
         * Registers an event listener for application events.
         */
        addEventListener(eventName: "login", callback: (event: any) => void): string | number;
        removeEventListener(eventName: "login", token: string | number): void;
    }

    interface ApplicationContext {
        env?: {
            apiHost: string;
        };
        route: {
            url: string;
            type: string; // e.g., "CUSTOM_TOOL", "GLOBAL_CUSTOM_TOOL", "OTHER", etc.
            name: string | null;
            id: string | null;
        };
    }

    interface ApplicationDescriptor {
        id: string;
        name: string;
    }

    interface NavigateOptions {
        target: string | OpenTarget;
        type?: string;
        context?: any;
    }

    interface OpenTarget {
        entityType: string;
        entityId: string;
    }

    interface OpenOptions {
        target: string | OpenTarget;
        type?: string;
    }

    interface OpenModalOptions {
        target: string | OpenTarget;
        name: string;
        type?: string;
        size?: "sm" | "md" | "lg" | "xl";
        [key: string]: any; // For additional options like 'showFooter', 'formType', etc.
    }

    interface ApplicationCapabilities {
        supportedActions: string[];
        supportedFeatures: string[];
    }

    interface PrintOptions {
        blob: any;
    }

    /**
     * Auth Object Interface
     */
    interface AuthObject {
        /**
         * Generates a new auth code for the caller.
         */
        createAuthCode(clientId?: string): Promise<string>;

        /**
         * Returns basic user identity information for the current user.
         */
        getUser(): Promise<UserIdentity>;

        /**
         * Generates an access token
         */
        getAccessToken(): Promise<string>;
    }

    interface UserIdentity {
        id: string;
        realm: string;
        firstName: string;
        lastName: string;
    }

    /**
     * Http Object Interface
     */
    interface HttpObject {
        /**
         * Executes an HTTP GET request.
         */
        get(url: string, headerObjOrAccessToken?: any): Promise<any>;

        /**
         * Executes an HTTP POST request.
         */
        post(url: string, contentObj: any, headerObjOrAccessToken?: any): Promise<any>;

        /**
         * Executes an HTTP PATCH request.
         */
        patch(url: string, contentObj: any, headerObjOrAccessToken?: any): Promise<any>;

        /**
         * Executes an HTTP PUT request.
         */
        put(url: string, contentObj: any, headerObjOrAccessToken?: any): Promise<any>;

        /**
         * Executes an HTTP DELETE request.
         */
        delete(url: string, headerObjOrAccessToken?: any): Promise<any>;
    }

    /**
     * Loan Object Interface
     */
    interface LoanObject {
        /**
         * Returns the entire Loan object in the v3 Loan Object model.
         */
        all(): Promise<any>;

        /**
         * Returns the value of a single field using its field ID.
         */
        getField(fieldId: string): Promise<any>;

        /**
         * Sets the values of one or more fields on the Loan.
         */
        setFields(fieldMap: { [fieldId: string]: any }): Promise<void>;

        /**
         * Syncs the loan workspace with any changes made by other users.
         */
        merge(): Promise<void>;

        /**
         * Indicates if the loan is editable or in a read-only state.
         */
        isReadOnly(): Promise<boolean>;

        /**
         * Executes calculations and business rules.
         */
        calculate(): Promise<void>;

        /**
         * Executes supported loan actions.
         */
        execAction(actionName: string, actionOptions?: any): Promise<any>;

        /**
         * Attempts to commit/save all pending changes for the current loan to the server.
         */
        commit(): Promise<void>;

        /**
         * Registers an event listener for loan events.
         */
        addEventListener(
            eventName: LoanEventName,
            callback: (event: any) => void,
        ): string | number;

        /**
         * Removes an event listener for loan events.
         */
        removeEventListener(eventName: LoanEventName, token: string | number): void;
    }

    type LoanEventName =
        | "precommit"
        | "committed"
        | "change"
        | "sync"
        | "open"
        | "close"
        | "premilestoneComplete";

    /**
     * Session Object Interface
     */
    interface SessionObject {
        /**
         * Sets a value into the session state for the object.
         */
        set(key: string, value: any): Promise<void>;

        /**
         * Returns a value already stored in the session object.
         */
        get(key: string): Promise<any>;
    }
}

// For browser instances that declare the elli object globally
declare global {
    namespace elli {
        const script: ElliScript.Script;
    }
}

// For Node.js instances
declare const script: ElliScript.Script;

export default script;
