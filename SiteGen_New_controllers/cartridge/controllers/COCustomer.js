'use strict';

/**
 * Controller for the first step of the cart checkout process, which is to ask the customer to login, register, or
 * checkout anonymously.
 *
 * @module controllers/COCustomer
 */

/* API Includes */
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

var Cart = require('~/cartridge/scripts/models/CartModel');
var Content = require('~/cartridge/scripts/models/ContentModel');

/**
 * First step of the checkout is to choose the checkout type: returning, guest or create account checkout.
 * Prepares the checkout initially: removes all payment instruments from the basket and clears all
 * forms used in the checkout process, when the customer enters the checkout. The single steps (shipping, billing etc.)
 * may not contain the form clearing, in order to support navigating forth and back in the checkout steps without losing
 * already entered form values.
 */
function start() {

    app.getForm('singleshipping').clear();
    app.getForm('multishipping').clear();
    app.getForm('billing').clear();

    Transaction.wrap(function () {
        Cart.goc().removeAllPaymentInstruments();
    });

    // Direct to first checkout step if already authenticated.
    if (customer.authenticated) {
        response.redirect(URLUtils.https('COShipping-Start'));
        return;
    } else {
        var loginForm = app.getForm('login');
        loginForm.clear();

        // Prepopulate login form field with customer's login name.
        if (customer.registered) {
            loginForm.setValue('username', customer.profile.credentials.login);
        }

        var loginAsset = Content.get('myaccount-login');

        var pageMeta = require('~/cartridge/scripts/meta');
        pageMeta.update(loginAsset);

        app.getView({
            ContinueURL: URLUtils.https('COCustomer-LoginForm')
        }).render('checkout/checkoutlogin');
    }

}

/**
 * Form handler for the login form. Handles the following actions:
 * - __login__ - Calls the {@link module:controllers/Login~process|Login controller Process function}. If this returns successfully, calls
 * the {@link module:controllers/COShipping~Start|COShipping controller Start function}.
 * - __register__ - Calls the {@link module:controllers/Account~StartRegister|Account controller StartRegister function}.
 * - __unregistered__ - Calls the {@link module:controllers/COShipping~Start|COShipping controller Start function}.
 */
function showLoginForm() {
    var loginForm = app.getForm('login');

    var formResult = loginForm.handleAction({
        login: function () {
            // Delegate login to appropriate authentication controller and react on success/failure
            // @TODO find better solution
            if (app.getController('Login').Process()) {
                response.redirect(URLUtils.https('COShipping-Start'));
                return;
            } else {
                return {};
            }
        },
        register: function () {

            response.redirect(URLUtils.https('Account-StartRegister'));

            return;
        },
        unregistered: function () {
            response.redirect(URLUtils.https('COShipping-Start'));

            return;
        }
    });

    if (formResult) {
        var loginAsset = Content.get('myaccount-login');

        var pageMeta = require('~/cartridge/scripts/meta');
        pageMeta.update(loginAsset);

        app.getView({
            ContinueURL: URLUtils.https('COCustomer-LoginForm')
        }).render('checkout/checkoutlogin');
    }
}

/*
 * Module exports
 */

/*
 * Web exposed methods
 */
/** Selects the type of checkout: returning, guest, or create account. The first step in the checkout process.
 * @see module:controllers/COCustomer~start */
exports.Start = guard.ensure(['https'], start);
/** Form handler for the login form.
 * @see module:controllers/COCustomer~showLoginForm */
exports.LoginForm = guard.ensure(['https', 'post'], showLoginForm);
